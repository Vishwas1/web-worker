const worker = new Worker('worker.js');

const genKeyDom  =  document.getElementById("gen_key")
const signDom  =  document.getElementById("sign")
const verifyDom  =  document.getElementById("verify")

console.log(genKeyDom)

const payload = {
    name: "Vishwas",
    email: "vishwas@email.com"
}

let options = {
    op_type: "GEN_KEY",
}


worker.onmessage = async (event) => {

    console.log('Inside worker.onmessage in app,js')
    
    const { data } =  event;
    if(data){
        const { op_type,  message } = data;
        console.log(message)
        
        switch(op_type){
            case "GEN_KEY": {
                
                break;
            }

            case "SIGN": {
                options = {
                    op_type: "VER",
                    data: { message: payload, signature: message }
                }
                break;
            }

            case "VER": {
                console.log(message)
                break;
            }
            default: {
                postMessage("Error: Invalid Operation");
            }
        }
    }
}

genKeyDom.addEventListener("click" , (event) => {
    console.log("gen key button clicked")
    const result = worker.postMessage(options);
    console.log(result);
})

signDom.addEventListener("click" , (event) => {
    console.log("signDom button clicked")
    options = {
        op_type: "SIGN",
        data: { message: payload }
    }
    const signature = worker.postMessage(options);    
    console.log(signature)
})

verifyDom.addEventListener("click" , (event) => {
    console.log("verifyDom button clicked")
    const ver_res = worker.postMessage(options);
    console.log(ver_res)
})






