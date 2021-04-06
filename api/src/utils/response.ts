const Response = (data: object, status: string, success: boolean): object => {
    return {
        status,
        success: success ? success : false,
        data
    }
}

export default Response
