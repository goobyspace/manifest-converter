import downloadIcon from "../../../assets/download.svg";

function DownloadButton({ patch }: { patch: string }) {
  const downloadPatch = () => {
    const file = new Blob([patch as BlobPart], { type: "json" });

    //it seems neater to have the a tag with the download actually in the html
    //and use a useEffect or something to update the file
    //but this works practically instantly and is a lot easier/lazier
    const a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = "patch.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="output-download">
      <button className="button" onClick={downloadPatch}>
        Download patch.json
        <img src={downloadIcon} className="icon" alt="Download icon" />
      </button>
    </div>
  );
}

export default DownloadButton;
