const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// CONFIGURATION
const TOKEN = 'MTU1MjY1MzY3MjMxMDI1MTU0MA.GrmakP.7bJYai8OVGSjIyjbi8doNUyDT2swFQulS5f_ag';
const ROLE_ACCES_ID = '1552654875488161884'; // ID du rôle d'accès général (Membre vérifié)

// Mapping des rôles par option (Remplace par les VRAIS IDs numériques de tes rôles)
const ROLES_MAP = {
  // TYPE PC
  'pc_prebuilt': '1552659824456769568',
  'pc_gamer': '1552659799320301578',
  'pc_laptop': '1552659778147455087',

  // RAM
  'ram_ddr4': '1552659230438199316',
  'ram_ddr5': '1552659196565000272',

  // PROCESSEUR
  'cpu_amd_x3d': '1552659622693838899',
  'cpu_amd_non_x3d': '1552659639680761948',
  'cpu_intel_non_k': '1552659657820995605',
  'cpu_intel_k': '1552659675550453840',
  'cpu_intel_unknown': '1552659693439025252',

  // CARTE GRAPHIQUE
  'gpu_nv_2000_less': '1552659512932958308',
  'gpu_nv_3000_plus': '1552659534953324544',
  'gpu_amd_5000_less': '1552659627852693655',
  'gpu_amd_6000_plus': '1552659649076138024',
  'gpu_intel_arc': '11552659735868866704',

  // CARTE MERE
  'mobo_intel_low': '1552659457803165728',
  'mobo_intel_high': '1552659489759698944',
  'mobo_intel_unknown': '1552659516615696456',
  'mobo_amd_a': '1552659539902472212',
  'mobo_amd_b_x': '1552659560362283008',
  'mobo_amd_unknown': '1552659584303366165'
};

// Stockage des réponses temporaires { userId: { pc: null, ram: null, cpu: null, gpu: null, mobo: null } }
const userSelections = new Map();

client.once('ready', () => {
  console.log(`Bot connecté en tant que ${client.user.tag}`);
});

// Commande administrative pour envoyer l'embed dans le salon
client.on('messageCreate', async (message) => {
  if (message.content === '!setup-roles' && message.member.permissions.has('Administrator')) {
    await message.delete();

    const embed = new EmbedBuilder()
      .setTitle('🖥️ Accés au serveur complet')
      .setDescription(
        'Bienvenue sur le serveur de Mopti !\n\n' +
        'Pour débloquer l\'accès au serveur et obtenir vos rôles personnalisés, veuillez répondre aux **5 questions** ci-dessous.\n\n' +
        'Cliquez sur le bouton ci-dessous pour ouvrir le formulaire.'
      )
      .setColor('#5865F2');

    const rowStart = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('start_verification')
        .setLabel('Choisir mes rôles')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📝')
    );

    await message.channel.send({
      embeds: [embed],
      components: [rowStart]
    });
  }
});

// Gestion des interactions
client.on('interactionCreate', async (interaction) => {
  const userId = interaction.user.id;

  // 1. Lancement du questionnaire (envoi des 5 menus)
  if (interaction.isButton() && interaction.customId === 'start_verification') {
    if (!userSelections.has(userId)) {
      userSelections.set(userId, { pc: null, ram: null, cpu: null, gpu: null, mobo: null });
    }

    const rowPC = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_pc')
        .setPlaceholder('1. Type de PC')
        .addOptions([
          { label: 'PC Fixe Prémonté (Acer, Dell, Lenovo, Asus, MSI...)', value: 'pc_prebuilt', emoji: '🖥️' },
          { label: 'PC Fixe Gamer Custom', value: 'pc_gamer', emoji: '🛎️' },
          { label: 'PC Portable', value: 'pc_laptop', emoji: '💻' },
        ])
    );

    const rowRAM = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_ram')
        .setPlaceholder('2. Type de RAM')
        .addOptions([
          { label: 'RAM DDR4', value: 'ram_ddr4', emoji: '🟡' },
          { label: 'RAM DDR5', value: 'ram_ddr5', emoji: '🟤' },
        ])
    );

    const rowCPU = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_cpu')
        .setPlaceholder('3. Processeur (CPU)')
        .addOptions([
          { label: 'AMD X3D', value: 'cpu_amd_x3d', emoji: '🔴' },
          { label: 'AMD non-X3D', value: 'cpu_amd_non_x3d', emoji: '🔴' },
          { label: 'Intel modèle non K', value: 'cpu_intel_non_k', emoji: '🔵' },
          { label: 'Intel modèle K', value: 'cpu_intel_k', emoji: '🔵' },
          { label: 'Intel ( ne sais pas )', value: 'cpu_intel_unknown', emoji: '🔵' },
        ])
    );

    const rowGPU = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_gpu')
        .setPlaceholder('4. Carte Graphique (GPU)')
        .addOptions([
          { label: 'Nvidia RTX 2000 et moins', value: 'gpu_nv_2000_less', emoji: '🟢' },
          { label: 'Nvidia RTX 3000 et +', value: 'gpu_nv_3000_plus', emoji: '🟢' },
          { label: 'AMD RX 5000 et moins', value: 'gpu_amd_5000_less', emoji: '🔴' },
          { label: 'AMD RX 6000 et +', value: 'gpu_amd_6000_plus', emoji: '🔴' },
          { label: 'Intel ARC', value: 'gpu_intel_arc', emoji: '🔵' },
        ])
    );

    const rowMobo = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('select_mobo')
        .setPlaceholder('5. Carte Mère')
        .addOptions([
          { label: 'Intel Hxxx / B460 et -', value: 'mobo_intel_low', emoji: '🔵' },
          { label: 'Intel B560 et + / Zxxx', value: 'mobo_intel_high', emoji: '🔵' },
          { label: 'Intel ( ne sais pas )', value: 'mobo_intel_unknown', emoji: '🔵' },
          { label: 'AMD Axxx', value: 'mobo_amd_a', emoji: '🔴' },
          { label: 'AMD Bxxx / X(xxx)', value: 'mobo_amd_b_x', emoji: '🔴' },
          { label: 'AMD ( ne sais pas )', value: 'mobo_amd_unknown', emoji: '🔴' },
        ])
    );

    await interaction.reply({
      content: 'Veuillez sélectionner une option dans **chacune** des 5 catégories. L\'attribution se fera dès que les 5 réponses seront enregistrées.',
      components: [rowPC, rowRAM, rowCPU, rowGPU, rowMobo],
      ephemeral: true
    });
    return;
  }

  // 2. Traitement des sélections dans les menus
  if (interaction.isStringSelectMenu()) {
    if (!userSelections.has(userId)) {
      userSelections.set(userId, { pc: null, ram: null, cpu: null, gpu: null, mobo: null });
    }

    const userChoices = userSelections.get(userId);
    const value = interaction.values[0];

    switch (interaction.customId) {
      case 'select_pc': userChoices.pc = value; break;
      case 'select_ram': userChoices.ram = value; break;
      case 'select_cpu': userChoices.cpu = value; break;
      case 'select_gpu': userChoices.gpu = value; break;
      case 'select_mobo': userChoices.mobo = value; break;
    }

    const { pc, ram, cpu, gpu, mobo } = userChoices;
    const answeredCount = [pc, ram, cpu, gpu, mobo].filter(Boolean).length;

    // Si les 5 choix ne sont pas encore tous faits
    if (answeredCount < 5) {
      await interaction.reply({
        content: ` Choix enregistré ! (${answeredCount}/5 catégories complétées). Veuillez répondre aux menus restants.`,
        ephemeral: true
      });
      return;
    }

    // Récupération de la liste des IDs de rôles à donner
    const rolesToAdd = [
      ROLE_ACCES_ID,
      ROLES_MAP[pc],
      ROLES_MAP[ram],
      ROLES_MAP[cpu],
      ROLES_MAP[gpu],
      ROLES_MAP[mobo]
    ].filter(Boolean); // Filtre pour s'assurer qu'aucun ID invalide ne passe

    try {
      await interaction.member.roles.add(rolesToAdd);
      userSelections.delete(userId); // Nettoyage de la mémoire

      await interaction.reply({
        content: '✅ **Vérification réussie !** Les 5 catégories ont été renseignées. Vos rôles matériel ainsi que le rôle d\'accès général vous ont été attribués.',
        ephemeral: true
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: '❌ Une erreur est survenue lors de l\'attribution des rôles. Vérifiez que les IDs sont bien réels et que le rôle du bot est positionné en haut de la hiérarchie.',
        ephemeral: true
      });
    }
  }
});

client.login(TOKEN);