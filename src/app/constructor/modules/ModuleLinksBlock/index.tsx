import React from "react"
import { useNavigate } from "react-router-dom"
import { KTSVG } from "../../../../_metronic/helpers"
import { TModuleLinksBlockLink, TModuleLinksBlock } from "./_types"

const LinkBlock: React.FC<TModuleLinksBlockLink> = ({title, link, icon}) => {
    const navigate = useNavigate()
    const handleClick = () => navigate(link)
    return <div className="moduleLinksBlock_blockContainer" onClick={handleClick}>
    <div className="moduleLinksBlock_block">
        <KTSVG path={`media/crm/icons/${icon}.svg`} className="moduleLinksBlock_blockIcon" svgClassName="" />
        <h5 className="moduleLinksBlock_blockTitle">{title}</h5>
    </div>

</div>
}

const ModuleLinksBlock: React.FC<TModuleLinksBlock> = (props) => {
    const { settings } = props
    const { title, links } = settings
    return <div className="moduleLinksBlock">
        <h4 className="moduleLinksBlock_title">{title}</h4>
        <div className="moduleLinksBlock_blocksContainer">
            {links.map(link => <LinkBlock  key={link.title + link.icon + link.link} {...link} /> )}
        </div>
    </div>
}

export default ModuleLinksBlock