export const encodeWav = (data, sampleRate = 16000) => {
    const numChannels = 1; // Mono audio
    const bytesPerSample = 2; // 16-bit PCM
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
  
    // Create WAV file header
    const buffer = new ArrayBuffer(44 + data.length * bytesPerSample);
    const view = new DataView(buffer);
  
    // RIFF chunk descriptor
    view.setUint32(0, 0x52494646, false); // "RIFF"
    view.setUint32(4, 36 + data.length * bytesPerSample, true); // Chunk size
    view.setUint32(8, 0x57415645, false); // "WAVE"
  
    // FMT sub-chunk
    view.setUint32(12, 0x666d7420, false); // "fmt "
    view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 = PCM)
    view.setUint16(22, numChannels, true); // Number of channels
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, byteRate, true); // Byte rate
    view.setUint16(32, blockAlign, true); // Block align
    view.setUint16(34, bytesPerSample * 8, true); // Bits per sample
  
    // Data sub-chunk
    view.setUint32(36, 0x64617461, false); // "data"
    view.setUint32(40, data.length * bytesPerSample, true); // Sub-chunk size
  
    // Write the PCM samples
    const dataOffset = 44;
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i] / 32767)); // Normalize to -1.0 to 1.0
      view.setInt16(dataOffset + i * bytesPerSample, sample * 32767, true); // Convert to 16-bit PCM
    }
  
    // Create and return a File object
    const blob = new Blob([buffer], { type: "audio/wav" });
    return new File([blob], "sound.wav", { type: "audio/wav" });
  };
  