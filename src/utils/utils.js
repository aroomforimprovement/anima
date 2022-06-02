import { EncryptJWT, jwtDecrypt } from 'jose';

export const arrayRemove = (arr, value) => {
    return arr.filter((e) => {
        return e !== value;
    });
}
export const getUserJwt = async (name, email, id) => {
    return await new EncryptJWT(
        {
            'urn:anima:username': name,
            'urn:anima:email': email,
            'urn:anima:userid': id
        }
    )
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .encrypt(Buffer.from(process.env.REACT_APP_LOCAL_SECRET));
}

export const getUserJwtDecrypted = async (jwt) => {
    return await jwtDecrypt(jwt, process.env.REACT_APP_LOCAL_SECRET);
}

export const getDontShowChoice = async (key) => {
    const choice = await JSON.parse(key);
    return choice.choice;
}