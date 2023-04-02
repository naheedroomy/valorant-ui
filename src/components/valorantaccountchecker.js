import React, { useState } from 'react';
import axios from 'axios';

const ValorantAccountChecker = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [data, setData] = useState({});
    const [discordId, setDiscordId] = useState('');
    const [discordVerified, setDiscordVerified] = useState(false);
    const [discordName, setDiscordName] = useState('');
    const [discordDiscriminator, setDiscordDiscriminator] = useState('');

    const verifyDiscordId = async () => {
        try {
            const response = await axios.post('http://localhost:8000/discord/verify_discord_id/', { discord_id: discordId });
            setDiscordName(response.data.name);
            setDiscordDiscriminator(response.data.discriminator);
            setDiscordVerified(true);
        } catch (error) {
            alert('Invalid Discord ID. Please enter a valid Discord ID and try again.');
        }
    };

    const checkAccount = async () => {
        try {
            const response = await axios.post('http://localhost:8000/account/login/riot', { username, password });
            setData(response.data);

            if (response.data.status === 'success') {
                const accountDetailsResponse = await axios.get(`http://localhost:8000/account/get/puuid/${response.data.puuid}`);
                setData(accountDetailsResponse.data);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const submit2faCode = async () => {
        try {
            const response = await axios.post(`http://localhost:8000/account/login/riot/2fa/${username}?code=${code}`);
            setData(response.data);
        } catch (error) {
            alert(error.message);
        }
    };

    const displayAccountInfo = (accountJson) => {
        return (
            <div>
                <h2>Account Details</h2>
                <p>Name and Tag: {accountJson.name_and_tag}</p>
                <p>Rank: {accountJson.rank}</p>
                <p>Current Tier: {accountJson.current_tier}</p>
                <p>Ranking in Tier: {accountJson.ranking_in_tier}</p>
                <p>MMR Change to Last Game: {accountJson.mmr_change_to_last_game}</p>
                <p>Elo: {accountJson.elo}</p>
            </div>
        );
    };

    return (
        <div>
            <h1>Valorant Account Checker</h1>
            {!discordVerified && (
                <div>
                    <h3>Verify Discord ID</h3>
                    <input
                        type="text"
                        value={discordId}
                        onChange={(e) => setDiscordId(e.target.value)}
                        placeholder="Discord ID"
                    />
                    <button onClick={verifyDiscordId}>Verify Discord ID</button>
                </div>
            )}

            {discordVerified && (
                <div>
                    <h3>Discord Name: {discordName}#{discordDiscriminator}</h3>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(            e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <button onClick={checkAccount}>Check Account</button>
                </div>
            )}

            {data.status === '2FA' && (
                <div>
                    <h3>Enter 2FA Code</h3>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="2FA Code"
                        maxLength={6}
                    />
                    <button onClick={submit2faCode}>Submit 2FA Code</button>
                </div>
            )}

            {data.status === 'success' && displayAccountInfo(data)}
        </div>
    );
};

export default ValorantAccountChecker;

