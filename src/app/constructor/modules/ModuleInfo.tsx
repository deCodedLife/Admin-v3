import React from "react"
import { Col, Form } from "react-bootstrap"
import { ModuleInfoAreaType, ModuleInfoBlockType, ModuleInfoFieldType, ModuleInfoType } from "../../types/modules"
import ComponentButton from "../components/ComponentButton"
import ComponentInfo from "../components/ComponentInfo"
import ComponentTooltip from "../components/ComponentTooltip"


const getAreaKey = (area: ModuleInfoAreaType) => {
    const concatedAreaTitles = area.blocks.reduce((acc, block) => `${acc}-${block.title}`, "")
    return `${area.size}${concatedAreaTitles}`
}
//Компонент, состоящий из поля определенного типа и лейбла
const InfoField: React.FC<ModuleInfoFieldType> = (props) => {
    const { title, value, data_type, field_type } = props
    return <div className="moduleInfo_field">
        <Form.Group as={Col} md={4}>
            <ComponentTooltip title={title}>
                <label className="moduleInfo_field_label">
                    {title}
                </label>
            </ComponentTooltip>
        </Form.Group>
        <Form.Group as={Col} md={8}>
            <ComponentInfo value={value} data_type={data_type} field_type={field_type} />
        </Form.Group>
    </div>
}
//Блок полей 
const InfoBlock: React.FC<ModuleInfoBlockType> = ({ title, fields }) => {
    return <div className="moduleInfo_block card">
        {
            title ? <div className="moduleInfo_block_title card-header">
                <div className="card-title">
                    <h3>
                        {title}
                    </h3>
                </div>
            </div> : null
        }
        <div className="moduleInfo_block_fields card-body">
            {fields.map(field => <InfoField key={field.article} {...field} />)}
        </div>

    </div>
}

const ModuleInfo: React.FC<ModuleInfoType> = ({ settings, components }) => {
    const { areas } = settings
    const buttons = Array.isArray(components) ? [] : components.buttons
    return <div className="moduleInfo">
        <div className="moduleInfo_fields">
            {areas.map(area => {
                return <Form.Group key={getAreaKey(area)} as={Col} md={area.size * 3}>
                    <div className="moduleInfo_area">
                        {area.blocks.map(block => <InfoBlock key={block.title} {...block} />)}
                    </div>
                </Form.Group>
            })}
        </div>
        <Form.Group as={Col} md={12}>
            <div className="componentButton_container">
                {buttons.map(button => <ComponentButton key={button.type} {...button} />)}
            </div>
        </Form.Group>
    </div>


}

export default ModuleInfo