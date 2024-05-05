import axios from "axios";
import { useState } from "react";
import goonerIcon from "/public/gooners-logo.svg";
import Image from "next/image";

export default function Pass() {
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleCreatePass = async () => {
        try {
            const response = await axios.post('/api/passes', {}, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);
        } catch (error) {
            console.error('Error downloading pass:', error);
        }
    }

    return (
        <div className="mx-auto max-w-screen-2xl flex justify-center items-center h-screen flex-col gap-12">
            <Image src={goonerIcon} alt="Gooner Icon" width={300} height={300} />

            <div className="flex flex-col gap-4 justify-center items-center">
                <h1 className="text-center text-xl md:text-3xl">Create A Membership Pass</h1>
                
                {!downloadUrl ? (
                    <button 
                        className="uppercase font-bold flex justify-center items-center border border-white rounded-3xl p-2 md:p-4 hover:border-gooner-red hover:text-gooner-red min-w-[150px] md:min-w-[200px] transition-colors duration-500" 
                        type="button" 
                        onClick={handleCreatePass}
                    >
                        Create
                    </button>
                ) : (
                    <a 
                        href={downloadUrl} 
                        download="membership_pass.pkpass" 
                        className="uppercase font-bold flex justify-center items-center border border-white rounded-3xl p-2 md:p-4 hover:border-gooner-red hover:text-gooner-red min-w-[150px] md:min-w-[200px] transition-colors duration-500"
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
}