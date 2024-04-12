import React from "react"
import { Dropdown } from "react-bootstrap";
import { KTSVG } from "../../../../_metronic/helpers";
import ComponentButton from "../ComponentButton";
import { TActionsDropdown, TComponentDropdown } from "./_types";


const ActionsDropdown: React.FC<TActionsDropdown> = React.forwardRef(({ children, onClick }, ref) => {
    return <button
        type="button"
        className="componentDropdown_toggle"
        //@ts-ignore
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        <KTSVG
            path='/media/crm/icons/dots-vertical.svg'
        />
    </button>
})

const ComponentDropdown: React.FC<TComponentDropdown> = ({ buttons }) => {
    return <Dropdown className="componentDropdown" drop="start"  >
        <Dropdown.Toggle as={ActionsDropdown} />
        <Dropdown.Menu popperConfig={{strategy: "fixed"}} renderOnMount>
            {buttons.map(button => <Dropdown.Item key={`${button.type}-${button.settings.title}-${button.settings.icon}`} onClick={event => event.preventDefault()}>
                <ComponentButton  {...button} className="moduleList_actionButton" />
            </Dropdown.Item>)}
        </Dropdown.Menu>
    </Dropdown>
}

export default ComponentDropdown