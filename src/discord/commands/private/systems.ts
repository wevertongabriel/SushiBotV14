import { db } from "@/database";
import { Command, Component } from "@/discord/base";
import { settings } from "@/settings";
import {
  brBuilder,
  createModalInput,
  createRow,
  hexToRgb,
} from "@magicyan/discord";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ChannelType,
  EmbedBuilder,
  codeBlock,
  TextInputStyle,
  Collection,
  GuildChannel,
  BaseGuildTextChannel,
  GuildTextBasedChannel,
  TextChannel,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { collection } from "typesaurus";

const globalActionData: Collection<string, "join" | "leave"> = new Collection();

new Command({
  name: "sistemas",
  description: "Comando de sistemas",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["Administrator"],
  options: [
    {
      name: "global",
      description: "Configurar sistema global",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "canal",
          description: "Alterar o canal do sistema global",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "canal",
              description: "Escolha o canal",
              type: ApplicationCommandOptionType.Channel,
              channelTypes: [ChannelType.GuildText],
              required,
            },
          ],
        },
        {
          name: "cargo",
          description: "Alterar o cargo do sistema global",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "cargo",
              description: "Escolha o cargo",
              type: ApplicationCommandOptionType.Role,
              required,
            },
          ],
        },
        {
          name: "mensagem",
          description: "Alterar a mensagem do sistema global",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "ação",
              description: "Escolha a ação",
              type: ApplicationCommandOptionType.String,
              choices: [
                { name: "Entrar", value: "join" },
                { name: "Sair", value: "leave" },
              ],
              required,
            },
          ],
        },
        {
          name: "cor",
          description: "Alterar a cor da mensagem do sistema global",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "ação",
              description: "Escolha a ação",
              type: ApplicationCommandOptionType.String,
              choices: [
                { name: "Entrar", value: "join" },
                { name: "Sair", value: "leave" },
              ],
              required,
            },
            {
              name: "cor",
              description: "Digite a cor hexadecimal. Exemplo: #434d88",
              type: ApplicationCommandOptionType.String,
              required,
            },
          ],
        },
      ],
    },
    {
      name: "logs",
      description: "Configurar sistema de logs",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "canal",
          description: "Alterar o canal do sistema de logs",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "canal",
              description: "Escolha o canal",
              type: ApplicationCommandOptionType.Channel,
              channelTypes: [ChannelType.GuildText],
              required,
            },
          ],
        },
      ],
    },
    {
      name: "ticketsystem",
      description: "Sistema de tickets",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "ticket-config",
          description: "Configuração do sistema de tickets",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "canal",
              description: "Definir canal de ticket",
              type: ApplicationCommandOptionType.Channel,
              channelTypes: [ChannelType.GuildText],
              required,
            },
            {
              name: "categoria",
              description:
                "Selecione a categoria onde os tickets devem ser criados.",
              type: ApplicationCommandOptionType.Channel,
              channelTypes: [ChannelType.GuildCategory],
              required,
            },
            {
              name: "mensagem",
              description: "Mensagem que ira aparecer no ticket",
              type: ApplicationCommandOptionType.String,
              required,
            },
            {
              name: "cargo-support",
              description: "Cargo de suporte para o ticket.",
              type: ApplicationCommandOptionType.Role,
              required,
            },
            {
              name: "everyone",
              description:
                "Selecione o cargo de everyone. (Você deve selecionar o cargo de everyone) IMPORTANTE",
              type: ApplicationCommandOptionType.Role,
              required,
            },
            {
              name: "button-name",
              description: "Nome do butão",
              type: ApplicationCommandOptionType.String,
              required,
            },
            {
              name: "emoji",
              description: "emoji do butão",
              type: ApplicationCommandOptionType.String,
              required,
            },
            {
              name: "descrição",
              description: "O texto a enviar com o painel de tickets",
              type: ApplicationCommandOptionType.String,
              required: false,
            },
          ],
        },
        {
          name: "delete-users",
          description:
            "Exclua os tickets dos usuários (use este comando somente se você removeu o ticket manualmente)",
          type: ApplicationCommandOptionType.Subcommand,
        },
        {
          name: "delete-setup",
          description: "Excluir o sistema de tickets (painel)",
          type: ApplicationCommandOptionType.Subcommand,
        },
      ],
    },
  ],
  async run(interaction) {
    const { options, guild, member, client } = interaction;

    const group = options.getSubcommandGroup(true);
    const subCommand = options.getSubcommand(true);

    if (subCommand !== "mensagem") {
      await interaction.deferReply({ ephemeral });
    }

    switch (group) {
      case "global": {
        switch (subCommand) {
          case "canal": {
            const channel = options.getChannel("canal", true);

            await db.upset(db.guilds, guild.id, {
              global: { channel: channel.id },
            });

            interaction.editReply({
              content: `O canal padrão do sistema global agora é o ${channel}!`,
            });
            return;
          }
          case "cargo": {
            const role = options.getRole("cargo", true);

            await db.upset(db.guilds, guild.id, {
              global: { role: role.id },
            });

            interaction.editReply({
              content: `O cargo padrão do sistema global agora é ${role}!`,
            });
            return;
          }
          case "mensagem": {
            const action = options.getString("ação", true) as "join" | "leave";

            const current = await db.get(db.guilds, guild.id);

            globalActionData.set(member.id, action);

            interaction.showModal({
              customId: "systems-global-message-modal",
              title: "Mensagem do sistema global",
              components: [
                createModalInput({
                  customId: "systems-global-message-input",
                  label: "Mensagem",
                  placeholder: "Digite a mensagem",
                  style: TextInputStyle.Paragraph,
                  value: current?.global?.messages?.[action],
                }),
              ],
            });

            return;
          }
          case "cor": {
            const action = options.getString("ação", true) as "join" | "leave";
            const color = options.getString("cor", true);

            const actionDisplay = action == "join" ? "entrar" : "sair";

            if (isNaN(hexToRgb(color))) {
              interaction.editReply({
                content:
                  "Você inseriu uma cor inválida! Este comando só aceita cores hexadecimais.",
              });
              return;
            }

            await db.upset(db.guilds, guild.id, {
              global: { colors: { [action]: color } },
            });

            const embed = new EmbedBuilder({
              color: hexToRgb(color),
              description: `${hexToRgb(color)}`,
            });
            interaction.editReply({
              content: `Cor da ação de ${actionDisplay} do sistema global foi alterada com sucesso!`,
              embeds: [embed],
            });
            return;
          }
        }
        return;
      }
      case "logs": {
        switch (subCommand) {
          case "canal": {
            const channel = options.getChannel("canal", true);

            await db.upset(db.guilds, guild.id, {});

            interaction.editReply({
              content: `O canal padrão do sistema de logs agora é o ${channel}!`,
            });
            return;
          }
        }
        return;
      }
      case "ticketsystem": {
        switch (subCommand) {
          case "ticket-config": {
            const channel = options.getChannel("canal", true, [
              ChannelType.GuildText,
            ]);
            const category = options.getChannel("categoria", true, [
              ChannelType.GuildCategory,
            ]);
            const handlers = options.getRole("cargo-support", true);
            const everyone = options.getRole("everyone", true);
            const button = options.getString("button-name", true);
            const emoji = options.getString("emoji", true);
            const description = options.getString("descrição");

            const embedConfig = new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setDescription("Sistema de tickets configurado com sucesso!")
              .setColor("Green")
              .addFields(
                {
                  name: "<:channel:1056715573242892338> Channel",
                  value: `<:icon_reply:1088996218283229184>  <#${channel?.id}>`,
                  inline: true,
                },
                {
                  name: "<:orangenwand:1056716503921205301> Cargo de Suporte",
                  value: `<:icon_reply:1088996218283229184>  <@&${handlers?.id}>`,
                  inline: true,
                },
                {
                  name: "<:Discussions:1056716758611939348> Descrição do Painel",
                  value: `<:icon_reply:1088996218283229184>  ${description}`,
                  inline: true,
                }
              );

            await interaction
              .editReply({ embeds: [embedConfig] })
              .catch(async (err) => {
                console.log(err);
                await interaction.editReply({
                  content: "ocorreu um erro...",
                });
              });

            const sampleMessage = `Bem-vindo ao tickets! Clique no botão **"${button}"** para criar um ticket e a equipe de suporte entrará em contato com você!`;

            const embedTicket = new EmbedBuilder()
              .setTitle("Sistema de Tickets")
              .setDescription(description == null ? sampleMessage : description)
              .setColor("Aqua")
              .setImage("https://i.imgur.com/MVWa8pZ.png");

            const guildSend = guild.channels.cache.get(
              channel.id
            ) as typeof channel;

            let row = createRow(
              new ButtonBuilder({
                customId: "systems-ticket-button",
                label: button,
                emoji: emoji,
                style: ButtonStyle.Primary,
              })
            );

            const sendTicketMessage = await guildSend
              .send({
                embeds: [embedTicket],
                components: [row],
              })
              .catch((err: any) => {
                return;
              });

            if (sendTicketMessage) {
              await db
                .upset(db.guilds, guild.id, {
                  global: {
                    ticketSetup: {
                      _id: interaction.guild?.id,
                      Channel: channel?.id,
                      Category: category?.id,
                      Handlers: handlers?.id,
                      Everyone: everyone?.id,
                      Description: description,
                      TicketMessageId: sendTicketMessage.id,
                    },
                  },
                })
                .catch((err: any) => {
                  return console.log(err);
                });
            } else {
              return interaction.editReply({
                content: "Erro ao enviar mensagem de ticket",
              });
            }
          }
          case "delete-users": {
            const data = await db.get(db.guilds, guild.id);
            if (!data || !data.ticketSystem) return;
            const ticketData = await db.get(data.ticketSystem, member.user.id);

            if (!ticketData) {
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Sistema de Tickets")
                    .setDescription(
                      "Já excluiu todos os tickets abertos por usuários no banco de dados!"
                    )
                    .addFields({
                      name: "<:Slash:1088996088712794162> IMPORTANTE",
                      value:
                        "<:icon_reply:1088996218283229184> **SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**",
                      inline: true,
                    }),
                ],
              });
            }

            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sistema de Tickets")
                  .setColor("Green")
                  .setDescription("Excluído com sucesso o sistema de tickets!")
                  .addFields({
                    name: "IMPORTANTE",
                    value:
                      "**SE TIVER TICKETS ABERTOS DEPOIS DE USAR ESTE COMANDO TERÁ QUE REMOVÊ-LOS MANUALMENTE**",
                  }),
              ],
            });
          }
          case "delete-setup": {
            const ticketData = await db.get(db.guilds, guild.id);

            if (!ticketData?.global?.ticketSetup) {
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setTitle("Sistema de Tickets")
                    .setDescription("Seu painel de tickets já foi excluído!")
                    .addFields({
                      name: "<:Slash:1088996088712794162> uSAR",
                      value:
                        "<:icon_reply:1088996218283229184>  /tickets setup",
                      inline: true,
                    }),
                ],
              });
            }

            db.delete(db.guilds, guild.id).catch((err: any) =>
              console.log(err)
            );

            interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle("Sistema de Tickets")
                  .setDescription("Excluído com sucesso o sistema de tickets!"),
              ],
            });
          }
        }
      }
    }
  },
});

new Component({
  customId: "systems-global-message-modal",
  type: "Modal",
  cache: "cached",
  async run(interaction) {
    const { member, fields, guild } = interaction;

    const action = globalActionData.get(member.id);
    if (!action) {
      interaction.reply({
        ephemeral,
        content: brBuilder(
          "Não foi possível achar os dados iniciais!",
          "Utilize o comando novamente."
        ),
      });
      return;
    }
    await interaction.deferReply({ ephemeral });

    const message = fields.getTextInputValue("systems-global-message-input");

    await db.upset(db.guilds, guild.id, {
      global: { messages: { [action]: message } },
      ticketSystem: { __type__: "collection", path: "" },
    });

    const text = action === "join" ? "entrada" : "saída";

    interaction.editReply({
      content: `A mensagem de ${text} do sistema global foi alterada!`,
    });
  },
});
