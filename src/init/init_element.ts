import {
    ElButton,
    ElInput,
    ElOption,
    ElSelect,
    ElTable,
    ElTableColumn,
    ElTag,
    ElDialog,
    ElTabs,
    ElTabPane,
    ElRadioButton,
    ElRadioGroup
} from 'element-plus'
export function useElements(app: any) {
    app.component(ElButton.name, ElButton)
    app.component(ElInput.name, ElInput)
    app.component(ElTable.name, ElTable)
    app.component(ElTableColumn.name, ElTableColumn)
    app.component(ElSelect.name, ElSelect)
    app.component(ElOption.name, ElOption)
    app.component(ElTag.name, ElTag)
    app.component(ElDialog.name, ElDialog)
    app.component(ElTabs.name, ElTabs)
    app.component(ElTabPane.name, ElTabPane)
    app.component(ElRadioButton.name, ElRadioButton)
    app.component(ElRadioGroup.name, ElRadioGroup)
}