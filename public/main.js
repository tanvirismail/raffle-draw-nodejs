
    let status = "<%= status %>";

    console.log(status)
    if(status == "complete"){
        document.querySelector('#complete').style.display = 'block';
    }


    const startBtn = document.querySelector('#start');

    startBtn.addEventListener('click', event => {
        axios.post('http://localhost:3000/store')
            .then(function (response) {
                var data = response.data
                if(data.status == "success"){
                    document.querySelector('#token').innerHTML = data.result;
                }
                else if(data.status == "complete"){
                    document.querySelector('#complete').style.display = 'block';
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    });
    