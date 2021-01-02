import {
    ElButton,
    ElInput,
    ElOption,
    ElSelect,
    ElTable,
    ElTableColumn,
    ElTag
} from 'element-plus'
export function useElements(app: any) {
    app.component(ElButton.name, ElButton)
    app.component(ElInput.name, ElInput)
    app.component(ElTable.name, ElTable)
    app.component(ElTableColumn.name, ElTableColumn)
    app.component(ElSelect.name, ElSelect)
    app.component(ElOption.name, ElOption)
    app.component(ElTag.name, ElTag)
}