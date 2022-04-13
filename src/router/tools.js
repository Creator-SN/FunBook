import loading from "@/components/general/loading.vue";

const AsyncLoad = function (component)
{
    const Handler = () => ({
        component: component,
        loading: loading,
        error: loading,
        delay: 100,
        timeout: 10000
    });
    return Promise.resolve({
        render(h)
        {
            return h(Handler);
        }
    });
};

window.AsyncLoad = AsyncLoad;

export default {
    AsyncLoad
};