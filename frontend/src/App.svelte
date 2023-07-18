<script lang="ts">
  import uploadLogo from "./assets/upload.svg";
  import { FileButton, FileDropzone } from "@skeletonlabs/skeleton";
  import axios from "axios";

  type Data = {
    color: number;
    level: number;
  };

  let filePath: string, fileName: string;
  let color: number, level: number;

  const compress = async (values: Data) => {
    const res = await axios.get("http://localhost:3005/compression", {
      params: {
        color: values.color || 256,
        level: values.level || 9,
        path: filePath,
      },
      responseType: "arraybuffer",
    });
    console.log(res);

    // const blob = new Blob([res.data], { type: "image/jpeg" });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement("a");
    // link.href = url;
    // link.download = fileName;
    // link.click();
    // URL.revokeObjectURL(url);

    // message.success("压缩成功");
  };
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
  <!-- <FileButton name="filebtn" /> -->
  <FileDropzone name="files">
    <!-- <svelte:fragment slot="lead">
      <img src={uploadLogo} class="upload" alt="Upload Logo" />
    </svelte:fragment>
    <svelte:fragment slot="message"
      >Upload a file or drag and drop</svelte:fragment
    >
    <svelte:fragment slot="meta">PNG,JPG and GIF allowed</svelte:fragment> -->
  </FileDropzone>
  <button on:click={() => compress({ color, level })}>压缩</button>
  <p class="read-the-docs">upload your picture 😋</p>
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
  .upload {
    height: 80px;
  }
  .read-the-docs {
    color: #888;
  }
</style>
