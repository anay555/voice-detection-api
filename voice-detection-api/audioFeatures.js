import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import wav from "node-wav";
import crypto from "crypto";

ffmpeg.setFfmpegPath(ffmpegPath);

export async function extractFeatures(base64Audio) {
  const id = crypto.randomUUID();
  const mp3Path = `/tmp/${id}.mp3`;
  const wavPath = `/tmp/${id}.wav`;

  fs.writeFileSync(mp3Path, Buffer.from(base64Audio, "base64"));

  await new Promise((resolve, reject) => {
    ffmpeg(mp3Path)
      .toFormat("wav")
      .on("end", resolve)
      .on("error", reject)
      .save(wavPath);
  });

  const buffer = fs.readFileSync(wavPath);
  const decoded = wav.decode(buffer);

  const signal = decoded.channelData[0];
  const duration = signal.length / decoded.sampleRate;

  let energy = 0;
  for (let i = 0; i < signal.length; i++) {
    energy += Math.abs(signal[i]);
  }
  energy /= signal.length;

  fs.unlinkSync(mp3Path);
  fs.unlinkSync(wavPath);

  return {
    duration: Number(duration.toFixed(2)),
    rms_energy: Number(energy.toFixed(4))
  };
}