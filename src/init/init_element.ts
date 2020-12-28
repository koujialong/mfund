import {
    ElButton,
    ElInput,
    ElTable,
    ElTableColumn
} from 'element-plus'
import App from './App.vue'
export function useElements(app: any) {
    app.component(ElButton.name, ElButton)
    app.component(ElInput.name, ElInput)
    app.component(ElTable.name, ElTable)
    app.component(ElTableColumn.name, ElTableColumn)
}