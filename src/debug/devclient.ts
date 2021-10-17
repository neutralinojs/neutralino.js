export function startAsync() {
    setInterval(async () => {
        try {
            let fetchResponse = await fetch('http://localhost:5050');
            let response = JSON.parse(await fetchResponse.text());
            if(response.needsReload) {
                location.reload();
            }
        }
        catch(e: any) {
            console.error('Unable to communicate with neu devServer');
        }
    }, 1000);
}
