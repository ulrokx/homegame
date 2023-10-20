import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { gameValidationSchema } from "../../../pages/games/create";
import { type AcceptedStatus } from "@prisma/client";
import { invitePlayerValidationSchema } from "../../../components/dialogs/InvitePlayerDialog";
import { TRPCError } from "@trpc/server";

export const gameRouter = createTRPCRouter({
  getGames: protectedProcedure.query(({ ctx }) => {
    return ctx.db.game.findMany({
      where: {
        players: {
          some: {
            playerEmail: ctx.session.user.email,
          }
        }
      }
    })
  }),
  getGame: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const game = await ctx.db.game.findUnique({
        where: {
          id: input.id,
        },
        include: {
          players: {
            include: {
              player: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });
      return game;
    }),
  createGame: protectedProcedure
    .input(gameValidationSchema)
    .mutation(({ input, ctx }) => {
      const owner = ctx.session?.user.email;
      const playersWithOwner = [...input.players, owner];
      return ctx.db.game.create({
        data: {
          name: input.name,
          owner: {
            connect: {
              email: owner,
            },
          },
          date: input.date,
          location: input.location,
          description: input.description,
          players: {
            create: playersWithOwner.map((email) => ({
              player: {
                connectOrCreate: {
                  where: {
                    email,
                  },
                  create: {
                    email,
                  },
                },
              },
            })),
          },
        },
      });
    }),
  updateGame: protectedProcedure
    .input(z.object({ gameId: z.string(), game: gameValidationSchema }))
    .mutation(async ({input: {gameId, game}, ctx }) => {
      const existingGame = await ctx.db.game.findFirstOrThrow({
        where: {
          id: gameId,
        },
        include: {
          players: true,
        }
      });
      if (existingGame.ownerEmail !== ctx.session.user.email) {
        throw "Access denied";
      }
      if (!game.players.includes(existingGame.ownerEmail)) {
        throw "Owner must be a player";
      }
      if (game.players.length < 2) {
        throw "Must have at least 2 players";
      }
      if (existingGame.status !== "PENDING" && !existingGame.players.every(player => game.players.includes(player.playerEmail))) {
        throw "Cannot remove players from a game that has already started";
      }
      if (game.players.length > game.players.length) {
        await ctx.db.playerStat.deleteMany({
          where: {
            gameId,
            playerEmail: {
              notIn: game.players,
            },
          },
        });
      }
      return ctx.db.game.update({
        where: {
          id: gameId,
        },
        data: {
          ...game,
          players: {
            connectOrCreate: game.players.map((email) => ({
              where: {
                playerEmail_gameId: {
                  gameId,
                  playerEmail: email,
                },
              },
              create: {
                player: {
                  connectOrCreate: {
                    where: {
                      email,
                    },
                    create: {
                      email,
                    },
                  },
                },
              },
            })),
          },
        },
      });
    }),
  updateAcceptedStatus: protectedProcedure
    .input(
      z.object({ gameId: z.string(), status: z.enum(["YES", "MAYBE", "NO"]) }),
    )
    .mutation(async ({ input: { gameId, status }, ctx }) => {
      const playerStat = await ctx.db.playerStat.findFirst({
          where: {
            gameId,
            playerEmail: ctx.session.user.email,
          },
          })
      if (!playerStat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        })
      }
      const playerEmail = ctx.session.user.email;
      await ctx.db.playerStat.update({
        where: {
          playerEmail_gameId: {
            gameId,
            playerEmail,
          },
        },
        data: {
          accepted: status as AcceptedStatus,
        },
      });
      return status;
    }),
  getAcceptedStatus: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ input: { gameId }, ctx }) => {
      const playerEmail = ctx.session.user.email;
      const playerStat = await ctx.db.playerStat.findUnique({
        where: {
          playerEmail_gameId: {
            gameId,
            playerEmail,
          },
        },
      });
      if (!playerStat) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Player not found",
        })
      }
      return playerStat.accepted;
    }),
  invitePlayer: protectedProcedure
    .input(invitePlayerValidationSchema)
    .mutation(async ({ input: { gameId, email }, ctx }) => {
      const game = await ctx.db.game.findFirst({
        where: {
          id: gameId,
        },
        include: {
          players: true,
        },
      });
      if (!game) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found",
        })
      }
      const isOwner = game.ownerEmail === ctx.session.user.email;
      if (!isOwner && !game.openInvite) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can invite players",
        })
      }
      if (game.players.find((player) => player.playerEmail === email)) {
        return false;
      }
      await ctx.db.playerStat.create({
        data: {
          game: {
            connect: {
              id: gameId,
            },
          },
          player: {
            connectOrCreate: {
              where: {
                email,
              },
              create: {
                email,
              },
            },
          },
        },
      });
      return true;
    }),
  deleteGame: protectedProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ input: { gameId }, ctx }) => {
      const existingGame = await ctx.db.game.findFirst({
        where: {
          id: gameId
        }
      });
      if (!existingGame) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Game not found"
        })
      }
      if (existingGame.ownerEmail !== ctx.session.user.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only the owner can delete a game"
        })
      }
      await ctx.db.game.delete({
        where: {
          id: gameId
        },
      })
      return true;
    }),
    startGame: protectedProcedure
      .input(z.object({ gameId: z.string() }))
      .mutation(async ({ input: { gameId }, ctx }) => {
        const existingGame = await ctx.db.game.findFirst({
          where: {
            id: gameId
          },
          include: {
            players: true,
          }
        });
        if (!existingGame) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found"
          })
        }
        if (existingGame.ownerEmail !== ctx.session.user.email) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the owner can start a game"
          })
        }
        if (existingGame.status !== "PENDING") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Game has already started"
          })
        }
        if (existingGame.players.length < 2) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Must have at least 2 players"
          })
        }
        const acceptedPlayers = existingGame.players.filter(player => player.accepted === "YES")
        if (acceptedPlayers.length < 2) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Must have at least 2 accepted players"
          })
        }

        await ctx.db.game.update({
          where: {
            id: gameId
          },
          data: {
            status: "IN_PROGRESS"
          }
        })
      })
});
