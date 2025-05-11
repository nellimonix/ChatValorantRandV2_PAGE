// Файл: src/App.js (модифицированный для работы без внешних изображений)
import React, { useState } from 'react';
import valorantLogo from './images/valorant-logo.png';

function App() {
    const [isPuuidMode, setIsPuuidMode] = useState(false);
    const [nameTag, setNameTag] = useState('');
    const [puuid, setPuuid] = useState('');
    const [region, setRegion] = useState('ap');
    const [hideUsername, setHideUsername] = useState(false);
    const [showRRChange, setShowRRChange] = useState(false);
    const [uniqueColor, setUniqueColor] = useState(false);
    const [platform, setPlatform] = useState('nightbot');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [exampleResponse, setExampleResponse] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const regions = [
        { value: 'ap', label: 'Asia/Pacific' },
        { value: 'br', label: 'Brazil' },
        { value: 'eu', label: 'Europe' },
        { value: 'kr', label: 'Korea' },
        { value: 'latam', label: 'Latin America' },
        { value: 'na', label: 'North America' }
    ];

    const platforms = [
        { value: 'nightbot', label: 'NightBot' },
        { value: 'streamelements', label: 'StreamElements' },
        { value: 'fossabot', label: 'Fossabot' },
        { value: 'streamlabs', label: 'Streamlabs' },
        { value: 'wizebot', label: 'WizeBot' },
        { value: 'others', label: 'Others' }
    ];

    const handleModeToggle = () => {
        setIsPuuidMode(!isPuuidMode);
        setGeneratedUrl('');
        setExampleResponse('');
    };

    const validateInput = () => {
        if (!isPuuidMode && !nameTag.includes('#')) {
            alert('Please enter a valid username in the format Name#Tag');
            return false;
        }

        if (isPuuidMode && !puuid.includes('-')) {
            alert('Please enter a valid PUUID');
            return false;
        }

        return true;
    };

    const generateUrl = () => {
        if (!validateInput()) return;

        const data = {
            username: nameTag,
            name: nameTag.split('#')[0],
            tag: nameTag.split('#')[1],
            puuid: puuid,
            region: region,
            onlyRank: hideUsername,
            mmrChange: showRRChange,
            uniqueColor: uniqueColor,
        };

        let url = isPuuidMode
            ? 'https://api.valorantrank.llimonix.pw/valorant-puuid'
            : 'https://api.valorantrank.llimonix.pw/valorant';

        url += '/' + data.region;
        url += isPuuidMode
            ? '/' + data.puuid
            : '/' + encodeURIComponent(data.name.replace(' ', '')) + '/' + encodeURIComponent(data.tag);

        const queryParams = [];
        if (data.onlyRank) queryParams.push('onlyRank=true');
        if (data.mmrChange) queryParams.push('mmrChange=true');

        if (queryParams.length > 0) {
            url += '?' + queryParams.join('&');
        }

        let formattedUrl;
        switch (platform) {
            case 'streamelements':
                formattedUrl = '$(customapi.' + url + ')';
                break;
            case 'nightbot':
            case 'fossabot':
                formattedUrl = '$(customapi ' + url + ')';
                break;
            case 'streamlabs':
                formattedUrl = '{readapi.' + url + '}';
                break;
            case 'wizebot':
                formattedUrl = '$urlcall(' + url + ')';
                break;
            default:
                formattedUrl = url;
        }

        if (uniqueColor) {
            formattedUrl = '/me ' + formattedUrl;
        }

        setGeneratedUrl(formattedUrl);

        // Set example response
        let buffer = '';
        if (!data.onlyRank) {
            buffer += isPuuidMode ? 'Name#Tag' : data.username;
            buffer += ' [Immortal 2] : 120 RR';
        } else {
            buffer += 'Immortal 2 : 120 RR';
        }
        if (data.mmrChange) buffer += ' [-22]';
        setExampleResponse(buffer);
    };

    const copyToClipboard = () => {
        if (generatedUrl.length <= 0) return;
        navigator.clipboard.writeText(generatedUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-md bg-valorant-darkGray rounded-lg shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-valorant-black p-5 flex items-center justify-center flex-col">
                    <img src={valorantLogo} alt="Valorant Logo" className="w-12 h-12 mb-2" />
                    <h1 className="title-valorant text-valorant-red text-2xl">VALORANT RANK CHAT</h1>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    <div className="flex justify-end items-center space-x-2">
                        <span className="text-sm font-medium text-valorant-lightGray">PUUID Mode</span>
                        <label className="relative inline-block w-10 h-5">
                            <input
                                type="checkbox"
                                className="opacity-0 w-0 h-0"
                                checked={isPuuidMode}
                                onChange={handleModeToggle}
                            />
                            <span className={`absolute cursor-pointer inset-0 rounded-full transition-colors ${isPuuidMode ? 'bg-valorant-red' : 'bg-gray-500'}`}>
                <span className={`absolute w-4 h-4 rounded-full bg-white transition-transform ${isPuuidMode ? 'transform translate-x-5' : 'translate-x-0.5'} top-0.5`}></span>
              </span>
                        </label>
                    </div>

                    {!isPuuidMode ? (
                        <div className="space-y-2">
                            <label htmlFor="nameTag" className="block text-sm font-medium text-valorant-lightGray">Name#Tag</label>
                            <input
                                type="text"
                                id="nameTag"
                                className="w-full px-4 py-2 bg-valorant-gray text-white rounded border border-gray-600 focus:border-valorant-red focus:ring-1 focus:ring-valorant-red focus:outline-none transition"
                                placeholder="Enter Name#Tag"
                                value={nameTag}
                                onChange={(e) => setNameTag(e.target.value)}
                            />
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <label htmlFor="puuid" className="block text-sm font-medium text-valorant-lightGray">PUUID</label>
                            <input
                                type="text"
                                id="puuid"
                                className="w-full px-4 py-2 bg-valorant-gray text-white rounded border border-gray-600 focus:border-valorant-red focus:ring-1 focus:ring-valorant-red focus:outline-none transition"
                                placeholder="Enter PUUID"
                                value={puuid}
                                onChange={(e) => setPuuid(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="region" className="block text-sm font-medium text-valorant-lightGray">Region</label>
                        <select
                            id="region"
                            className="w-full px-4 py-2 bg-valorant-gray text-white rounded border border-gray-600 focus:border-valorant-red focus:ring-1 focus:ring-valorant-red focus:outline-none transition"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            {regions.map((reg) => (
                                <option key={reg.value} value={reg.value}>{reg.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="hideUsername"
                                className="w-4 h-4 text-valorant-red bg-valorant-gray border-gray-600 focus:ring-valorant-red rounded"
                                checked={hideUsername}
                                onChange={(e) => setHideUsername(e.target.checked)}
                            />
                            <label htmlFor="hideUsername" className="text-sm font-medium text-valorant-lightGray">Hide username in response</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="showRRChange"
                                className="w-4 h-4 text-valorant-red bg-valorant-gray border-gray-600 focus:ring-valorant-red rounded"
                                checked={showRRChange}
                                onChange={(e) => setShowRRChange(e.target.checked)}
                            />
                            <label htmlFor="showRRChange" className="text-sm font-medium text-valorant-lightGray">Show RR change in response</label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="uniqueColor"
                                className="w-4 h-4 text-valorant-red bg-valorant-gray border-gray-600 focus:ring-valorant-red rounded"
                                checked={uniqueColor}
                                onChange={(e) => setUniqueColor(e.target.checked)}
                            />
                            <label htmlFor="uniqueColor" className="text-sm font-medium text-valorant-lightGray group relative">
                                Colored response
                                <span className="invisible group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap">
                  /me on Twitch
                </span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="platform" className="block text-sm font-medium text-valorant-lightGray">Platform</label>
                        <select
                            id="platform"
                            className="w-full px-4 py-2 bg-valorant-gray text-white rounded border border-gray-600 focus:border-valorant-red focus:ring-1 focus:ring-valorant-red focus:outline-none transition"
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                        >
                            {platforms.map((plat) => (
                                <option key={plat.value} value={plat.value}>{plat.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={generateUrl}
                        className="w-full bg-valorant-red hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        GENERATE COMMAND
                    </button>

                    {generatedUrl && (
                        <div className="mt-4">
                            <div className="relative bg-valorant-gray rounded p-3 break-all text-white text-sm">
                                <div className="pr-8">{generatedUrl}</div>
                                <button
                                    onClick={copyToClipboard}
                                    className="absolute right-2 top-3 text-gray-400 hover:text-white transition"
                                    title="Copy to clipboard"
                                >
                                    {isCopied ? (
                                        <span className="text-green-500">Copied!</span>
                                    ) : (
                                        <span className="text-lg">📋</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {exampleResponse && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-valorant-lightGray mb-2">Example Response:</h3>
                            <div className={`p-3 rounded ${uniqueColor ? 'bg-purple-700' : 'bg-valorant-gray'} text-white font-medium`}>
                                {exampleResponse}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-valorant-black p-4 flex flex-wrap items-center justify-center gap-3 text-sm">
                    <a href="https://github.com/nellimonix" className="text-gray-300 hover:text-valorant-red flex items-center gap-1 transition">
                        <span>👤</span> @nellimonix
                    </a>
                    <a href="https://github.com/nellimonix/ChatValorantRankV2" className="text-gray-300 hover:text-valorant-red flex items-center gap-1 transition">
                        <span>⭐</span> Star
                    </a>
                    <a href="https://github.com/nellimonix/ChatValorantRankV2/subscription" className="text-gray-300 hover:text-valorant-red flex items-center gap-1 transition">
                        <span>👁️</span> Watch
                    </a>
                    <a href="https://github.com/nellimonix/ChatValorantRankV2/issues" className="text-gray-300 hover:text-valorant-red flex items-center gap-1 transition">
                        <span>⚠️</span> Issues
                    </a>
                    <a href="https://github.com/sponsors/nellimonix" className="text-gray-300 hover:text-valorant-red flex items-center gap-1 transition">
                        <span>❤️</span> Sponsor
                    </a>
                </div>
            </div>
        </div>
    );
}

export default App;
