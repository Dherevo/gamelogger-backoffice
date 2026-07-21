import { Component, Vue, toNative } from "vue-facing-decorator";
import auth from "@/modules/auth";

@Component({ })
class DefaultLayout extends Vue {

    loading: boolean = true;

    created() {

        // Comprobar si estamos loggeados
        auth.isLoggedIn()
        .then(() => {
            this.to('/patients');
        })
        .catch(() => {
            this.loading = false;
        })

    }

}
export default toNative(DefaultLayout);