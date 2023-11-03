import { Button, Container, ListGroup, Card, Navbar } from 'react-bootstrap';
import { useState } from 'react';
import './App.css';
import { subscribeToWebSocketPrice } from './backend/price-rate'
import { useEffect } from 'react';
import { subscribeToWebSocket } from './backend/ws';
import { createInvoice, getTransactions, getWalletDetails } from './backend/https';
import { QRCodeSVG } from 'qrcode.react';

function App() {
    const [message, setMessage] = useState(null);
    const [bolt, setBolt] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [btcPrice, setBtcPrice] = useState(0);
    const [amountForm, setAmountForm] = useState(5);

    const addTransaction = (amount, memo) => {
        // Use the functional update form of setTransactions to ensure you're working with the latest state.
        setTransactions((prevTransactions) => [{ amount, memo }, ...prevTransactions]);
    };


    useEffect(() => {
        const listTransactions = async () => {
            const list = await getTransactions();

            // Create a temporary array to accumulate the transactions.
            const updatedTransactions = [...transactions];

            list.forEach((payment) => {
                let { amount, memo } = payment;
                amount = amount / 1000;
                updatedTransactions.push({ amount, memo });
            });

            // Update the state with all accumulated transactions.
            setTransactions(updatedTransactions);
        };

        const walletDetails = async () => {
            const res = await getWalletDetails();

            setBalance(res.balance / 1000);
            
        }

        const unsubscribe = subscribeToWebSocket((data) => {
            console.log('1' + data)
            setMessage(data);
            const { memo, amount } = data.payment;
            setBolt('');
            addTransaction(amount / 1000, memo);
            setBalance(data.wallet_balance);
        });

        const unsubscribeP = subscribeToWebSocketPrice((price) => {
            setBtcPrice(price);

        });

        walletDetails();
        listTransactions();

        return () => {
            // Asegúrate de cancelar la suscripción al desmontar el componente.
            unsubscribe();
            unsubscribeP();
        };
    }, [])

    const handleCreateInvoice = async (e) => {
        const invoice = await createInvoice(amountForm, 'Invoice');

        setBolt(invoice.payment_request);
    }

    return (
        <>
            <Navbar expand='lg' sticky='top' bg='dark' variant='dark'>
                <Container>
                    <Navbar.Brand>Brief wallet</Navbar.Brand>
                </Container>
            </Navbar>

            <Container className='app' >
                <br/>
                <Card>
                    <Card.Header><h5>Your balance</h5>    <span>BTC Price: ${btcPrice}</span></Card.Header>
                    <Card.Body><h1>{balance != 0 ?  balance.toFixed(0) + ' SATS = $' + (balance * btcPrice / 100000000).toFixed(2) : 0}</h1></Card.Body>
                </Card>
                <br/>
                <Button variant='primary' onClick={handleCreateInvoice}>Create Invoice</Button>
                <input value={amountForm} onChange={(e) => setAmountForm(e.target.value)}></input>
                <br/>
                {bolt ? <QRCodeSVG value={bolt} size={250} /> : ''}
                <br/>
                <ListGroup>
                    <h5>Transactions</h5>
                    {transactions.map((transaction) => {
                        return (<ListGroup.Item>amount: {transaction.amount}  Description: {transaction.memo}</ListGroup.Item>)
                    })}
                </ListGroup>
            </Container>
        </>
    );
}

export default App;
