const getDocs = async () => {
    try {
        const res = await fetch('https://docs.web3forms.com/how-to-guides/auto-response-email');
        const text = await res.text();
        console.log(text.substring(0, 2000));
    } catch(e) {
        console.error(e);
    }
}
getDocs();
