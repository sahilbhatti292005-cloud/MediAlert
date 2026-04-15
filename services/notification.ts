
export const NotificationService = {
  requestPermission: async () => {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  },

  showNotification: (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'https://cdn-icons-png.flaticon.com/512/1040/1040238.png'
      });
    }
  },

  playAlertSound: () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.loop = true;
    audio.play().catch(e => console.error("Sound play failed:", e));
    return audio;
  }
};
