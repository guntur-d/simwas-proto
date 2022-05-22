import ref from "./ref"

var temuan = {
   

     Baru: () => {

        var oid = ref.ObjectID('temuan')
        
        ref.recBttn = null

        ref.formId = oid 
        var arrParam = [
            { id: "id", type: "text", ph: oid, value: oid, disabled: true },
            { id: "bobot", type: "number", ph: "BOBOT", value: 100, disabled: false },
            { id: "desc", type: "text", ph: "Uraian", value: "", disabled: false }
        ]
        var ids = arrParam.map(arr => arr.id)

        var onSubmit = (e) => {
            e.preventDefault()

            var temuan = {
                id: document.getElementById(ids[0]).value,
                bobot: document.getElementById(ids[1]).value,
                desc: document.getElementById(ids[2]).value
            }
            var exArray = ref.recData.temuan
            var Obj, Obj2
            if (exArray == undefined) { Obj = { temuan: [temuan] } } else {

                exArray.push(temuan)

                Obj = { temuan: exArray }
            }

            Object.assign(ref.recData, Obj)

            ref.newTemuan = temuan

            exArray = ref.TemuanRef.ref
            if (exArray == undefined) { Obj2 = { ref: [temuan] } } else {

                exArray.push(temuan)
                Obj2 = { ref: exArray }
            }
            Object.assign(ref.TemuanRef, Obj2)

            ref.newrowallowed = true
            ref.state.form = null
            ref.formId = null

        }

        ref.state.form = ref.form(arrParam, oid, onSubmit)

    },

     
   
}

export default temuan