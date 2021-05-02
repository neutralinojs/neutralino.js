import { request, RequestType } from '../http/request';

export let devClient = {
    start: function () {
        setInterval(async () => {
            try {
                let response = await request({
                    url: 'http://localhost:5050',
                    type: RequestType.GET
                });
                if(response.needsReload) {
                    location.reload();
                }
            }
            catch(e) {
                console.error('Unable to communicate with neu devServer');
            }
        }, 1000);
    }
}
