export const encodeWav = (data) => {
    const buffer = new Uint8Array(data); // Assuming data is in correct format
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return new File([blob], 'sound.wav', { type: 'audio/wav' });
  };
  