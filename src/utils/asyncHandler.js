const asyncHandler= (fn) => {
    return (req,res,next)=>{
        Promise.resolve(fn(req,res,next)).catch((err)=>{
            next(err)
        })
    }
}

export default asyncHandler
// This function takes an async function (fn) as an argument and returns a new function that handles errors.