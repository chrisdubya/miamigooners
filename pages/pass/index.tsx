import axios from "axios";
import { useState } from "react";
import goonerIcon from "/public/images/logos/gooners-logo.svg";
import Image from "next/image";

export default function Pass() {
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [memberName, setMemberName] = useState<string>('');
    const [membershipNumber, setMembershipNumber] = useState<string>('');

    const handleCreatePass = async (e: any) => {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axios.post('/api/passes', {
                memberName: memberName,
                membershipNumber: membershipNumber,
            }, {
                responseType: 'blob'
            });

            if (response.status !== 200) {
                throw new Error('Error creating pass');
            }
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            setDownloadUrl(url);

            setMemberName('');
            setMembershipNumber('');
        } catch (error) {
            console.error('Pass Error:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-screen-2xl flex items-center h-[calc(100vh-2rem)] flex-col gap-12 mt-8">
            <Image src={goonerIcon} alt="Gooner Icon" width={250} height={250} />

            <div className="flex flex-col gap-4 justify-center items-center max-w-80">
                <h1 className="text-center text-xl md:text-3xl">Create Membership Pass</h1>

                <form className="w-full" onSubmit={handleCreatePass}>
                    <div className="flex flex-col gap-4">
                        <input
                            required
                            type="text" 
                            id="memberName" 
                            name="memberName"
                            value={memberName}
                            onChange={e => setMemberName(e.target.value)}
                            className="w-full border border-white rounded-xl p-2 md:p-4 text-black" 
                            placeholder="Member Name" 
                        />

                        <input 
                            required
                            type="text" 
                            id="membershipNumber" 
                            name="membershipNumber"
                            value={membershipNumber}
                            onChange={e => setMembershipNumber(e.target.value)}
                            className="w-full border border-white rounded-xl p-2 md:p-4 text-black" 
                            placeholder="Member No." 
                        />

                        {!downloadUrl && (
                            <button
                                disabled={loading}
                                className="w-full uppercase font-bold flex justify-center items-center border border-white rounded-xl p-2 md:p-4 hover:border-gooner-red hover:text-gooner-red transition-colors duration-500" 
                                type="submit"
                            >
                                {loading ? 'Generating...' : 'Create'}
                            </button>
                        )}
                    </div>

                </form>

                {downloadUrl && (
                    <a 
                        href={downloadUrl} 
                        download="membership_pass.pkpass" 
                        className="w-full uppercase font-bold flex justify-center items-center border border-white rounded-xl p-2 md:p-4 hover:border-gooner-red hover:text-gooner-red transition-colors duration-500"
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
}