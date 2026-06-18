let activeCtx: AudioContext | null = null;
let activeGain: GainNode | null = null;
let activeOscillators: OscillatorNode[] = [];

export function playAlarm(duration = 15) {
  try {
    stopAlarm();

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    activeCtx = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.4, ctx.currentTime);
    masterGain.connect(ctx.destination);
    activeGain = masterGain;

    const freqs = [440, 554.37, 659.25];
    const oscillators: OscillatorNode[] = [];

    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      osc.type = freq === 440 ? 'square' : 'sine';
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);

      for (let t = 0; t < duration; t += 0.5) {
        const beatStart = ctx.currentTime + t;
        const beatEnd = beatStart + 0.4;
        gain.gain.setValueAtTime(0.3, beatStart);
        gain.gain.setValueAtTime(0, beatEnd);
      }

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      oscillators.push(osc);
    }

    activeOscillators = oscillators;

    if (ctx.state === 'suspended') ctx.resume();

    setTimeout(stopAlarm, duration * 1000 + 100);
  } catch {
    // Silent fail
  }
}

export function playShortSound(duration = 3) {
  try {
    if (activeCtx) stopAlarm();

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);

    activeCtx = ctx;
    activeGain = gain;
    activeOscillators = [osc];

    setTimeout(() => {
      if (activeCtx === ctx) {
        activeCtx = null;
        activeGain = null;
        activeOscillators = [];
      }
    }, duration * 1000 + 100);

    if (ctx.state === 'suspended') ctx.resume();
  } catch {
    // Silent fail
  }
}

export function stopAlarm() {
  try {
    activeOscillators.forEach(o => o.stop());
    activeOscillators = [];
    if (activeGain) activeGain.disconnect();
    if (activeCtx) activeCtx.close();
    activeCtx = null;
    activeGain = null;
  } catch {
    // Silent fail
  }
}
