
const state = {
    selectUser: [],
    pageRouter: '',

}
const mutations = {

    mutationsAddUser(state, user) {
        if (user.checked == true) {
            let e = state.selectUser.findIndex(item => {
                return item.username === user.username
            })
            if (e == -1) {
                state.selectUser.push(user)
            }
        } else if (user.checked == false) {
            state.selectUser.forEach((item, index) => {
                if (user.username == item.username) {
                    state.selectUser.splice(index, 1)

                }
            })

        }
    }
}
const actions = {
    actionsadduser(context, e) {
        setTimeout(() => {
            context.commit('mutationsAddUser', e)
        }, 1);

    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
}
