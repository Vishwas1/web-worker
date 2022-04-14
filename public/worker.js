


    let keyPair;

    const encodeText = (text) => {
        const enc = new TextEncoder();
        return enc.encode(text);
    }

    const verify = (signature, message) => {
        console.log("Worker thread: verify")
        const encoded = encodeText(message);
        return crypto.subtle.verify(
            {
              name: "ECDSA",
              hash: {name: "SHA-384"},
            },
            keyPair.publicKey,
            signature,
            encoded
          );
    }

    const sign = (message) => {
        console.log("Worker thread: sign")
        const encoded = encodeText(message);
        return crypto.subtle.sign(
            {
              name: "ECDSA",
              hash: {name: "SHA-384"},
            },
            keyPair.privateKey,
            encoded
          );
    }

    const generateKey = () => {
        console.log("Worker thread: generateKey")
        return crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-384"
            },
            true,
            ["sign", "verify"]
        )
    }



    onmessage = async (options) => {

        const { op_type, data } = options.data;

        console.log("Message receieved in worker")

        console.log({
            op_type, data
        })

        let message;

        switch(op_type){
            case "GEN_KEY": {
                keyPair = await generateKey();
                postMessage({
                    op_type,
                    message: "success"
                });
                break;
            }

            case "SIGN": {
                if(data) {
                    const { message } = data;
                    const res = await sign(message)
                    postMessage({
                        op_type,
                        message: res
                    });
                }
                break;
            }

            case "VER": {
                const { signature,  message } = data;
                const res  =  await verify(signature,  message)
                postMessage({
                    op_type,
                    message: res

                })
                break;
            }
            default: {
                postMessage("Error: Invalid Operation");
            }
        }
    }


