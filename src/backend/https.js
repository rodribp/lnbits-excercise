const DOMAIN = 'https://legend.lnbits.com/';
const WALLET_ID = 'db2eeb7bfaec4db0b5157535cf74037f';
const ADMIN_KEY = '63949cfa49584853b9ee05fb88fa6fa9';
const INVOICE_READ_KEY = 'f088ec4d6b0d4ecfae226bb55a4b3a49';
const USR_ID = '6002fb33cb80405799698f5d619446f4';

const API_URL = DOMAIN + 'api/v1/';

const httpApiGet = async (path) => {
    const response = await fetch(API_URL + path,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "X-Api-Key": INVOICE_READ_KEY
            }
        }
        );

    let json = await response.json();

    if (json.error) {
        console.log(json.error);
    }

    return json;
}

const httpApiPost = async (path, body) => {
    const response = await fetch(API_URL + path,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "X-Api-Key": INVOICE_READ_KEY
                },
                body: JSON.stringify(body)
            }
        );
    
    let json = await response.json();

    if (json.error) {
        console.log(json.error);
    }
    
    return json;
}

const getTransactions = async () => {
    const response = await httpApiGet('payments');

    return response;
}

const getWalletDetails = async () => {
    const response = await httpApiGet('wallet');

    return response;
}

const createInvoice = async (amount, memo) => {
    const response = await httpApiPost('payments', {
        out: false,
        amount: amount,
        memo: memo
    });

    return response;
}

export {WALLET_ID, 
        getTransactions,
        createInvoice,
        getWalletDetails}