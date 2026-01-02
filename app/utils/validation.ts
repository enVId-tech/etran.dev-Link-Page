"use server";
import dotenv from 'dotenv';

dotenv.config();

interface DomainObject {
    domain_names: string;
}

interface TokenResponse {
    token: string;
}

const NPM_LINK: string | undefined = process.env.NPM_LINK;
const DOMAIN_NAME: string | undefined = process.env.DOMAIN_NAME;

export async function getToken(): Promise<string> {
    if (!process.env.IDENTITY || !process.env.SECRET) {
        console.log('Error: ', 'Identity or Secret not found');
        return "";
    }

    const data = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "identity": process.env.IDENTITY,
            "secret": process.env.SECRET
        })
    }

    if (!NPM_LINK) return "";

    const response: Response = await fetch(`${NPM_LINK}/api/tokens`, data);

    if (!response.ok) {
        console.log('Error: ', response.statusText);
        return "";
    }

    const json: TokenResponse = await response.json();

    if (!json.token) {
        console.log('Error: ', 'Token not found');
        return "";
    }

    return json.token;
}

export async function getProxyHosts(): Promise<string[]> {
    const token: string = await getToken();

    if (!NPM_LINK) return []

    const response2 = await fetch(`${NPM_LINK}/api/nginx/proxy-hosts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const json2: DomainObject[] = await response2.json();

    const responseArr: string[] = [];

    for (const key in json2) {
        if (!json2[key].domain_names) {
            continue;
        }

        const name: string = json2[key].domain_names[0]

        responseArr.push(name);
    }

    return responseArr;
}

export async function getRedirectHosts(): Promise<string[]> {
    const token: string = await getToken();

    if (!NPM_LINK) return []

    const response2 = await fetch(`${NPM_LINK}/api/nginx/redirection-hosts`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const json2: DomainObject[] = await response2.json();

    const responseArr: string[] = [];

    for (const key in json2) {
        if (!json2[key].domain_names) {
            continue;
        }

        const name: string = json2[key].domain_names[0]

        responseArr.push(name);
    }

    return responseArr;
}

export async function checkUrl(url: string): Promise<boolean> {
    try {
        if (!NPM_LINK) return true
        if (!DOMAIN_NAME) return true

        const response = await fetch(`${url}`, {
            method: 'HEAD'
        });

        const urlResolves: boolean = response.status < 400;

        if (!url.includes(DOMAIN_NAME)) return urlResolves

        const rHosts = await getRedirectHosts();
        const pHosts = await getProxyHosts();

        let rHostResolves: boolean = false;
        let pHostResolves: boolean = false;

        for (let link of rHosts) {
            const urlSplit = url.split("//")[1]
            if (urlSplit === link) {
                rHostResolves = true;
                break;
            }
        }
        for (let link of pHosts) {
            const urlSplit = url.split("//")[1]
            if (urlSplit === link) {
                pHostResolves = true;
                break;
            }
        }

        return (urlResolves && (rHostResolves || pHostResolves))
    } catch (error) {
        console.error(error);
        return false;
    }
}