export const sendDiscordLog = async (message: string) => {
  const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn("Discord Webhook URL එක .env එකේ නෑ!");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // මෙතන අපිට Discord එකේ පේන්න ඕනේ විදිය හදන්න පුළුවන්
      body: JSON.stringify({
        content: `🔔 **System Notification**\n${message}`,
        username: "MyBuddy Admin Bot", // Bot ගේ නම
      }),
    });
  } catch (error) {
    console.error("Discord එකට මැසේජ් එක යවන්න බැරි වුණා:", error);
  }
};