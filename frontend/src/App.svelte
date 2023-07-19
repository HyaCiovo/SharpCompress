<script lang="ts">
  import uploadLogo from "./assets/upload.svg";
  import axios from "axios";
  import type { Data } from "./types";

  let filePath: string, fileName: string;
  let color: number, level: number;
  let compressedFile: any;

  const compress = async (values: Data) => {
    const res = await axios.get("http://localhost:3005/compression", {
      params: {
        color: values.color || 256,
        level: values.level || 9,
        path: filePath,
      },
      responseType: "arraybuffer",
    });

    const blob = new Blob([res.data], { type: "image/jpeg" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const download = () => {};
</script>

<main>
  <div class="flex justify-center">
    <a href="https://sharp.pixelplumbing.com/" target="_blank" rel="noreferrer">
      <img
        src="https://cdn.jsdelivr.net/gh/lovell/sharp@main/docs/image/sharp-logo.svg"
        class="logo sharp"
        alt="Sharp Logo"
      />
    </a>
  </div>

  <h1>Sharp Compress</h1>
  <button class="mt-5" on:click={() => compress({ color, level })}
    >compress</button
  >

  <button class="mt-5" on:click={download}>download</button>
  <p>here! you can download your compressed picture😋</p>
</main>

<style>
  .logo {
    height: 10em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo.sharp:hover {
    filter: drop-shadow(0 0 2em #99cc00aa);
  }
</style>
