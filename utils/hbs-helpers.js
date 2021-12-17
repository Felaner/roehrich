module.exports = {
    function(context, options) {
        let fn = options.fn, inverse = options.inverse, ctx;
        let ret = "";

        if(context && context.length > 0) {
            for(let i=0, j=context.length; i<j; i++) {
                ctx = Object.create(context[i]);
                ctx.index = i;
                ret = ret + fn(ctx);
            }
        } else {
            ret = inverse(this);
        }
        return ret;
    }
}