import React from "react"
import { KTSVG } from "../../../../_metronic/helpers"
import { TDefaultModule } from "../_types";
import { useIntl } from "react-intl"

const ModuleInCreation: React.FC<TDefaultModule> = ({ type }) => {
    const intl = useIntl()
    return <div className="moduleInCreation">
        <div className="moduleInCreation_image">
            <KTSVG path='/media/icons/duotune/coding/cod004.svg' className=' svg-icon-1' />
        </div>
        <p className="moduleInCreation_description">
            {`${intl.formatMessage({ id: "MODULE_IN_CREATION.MODULE" })} ${type} ${intl.formatMessage({ id: "MODULE_IN_CREATION.DESCRIPTION" })} :)`}
        </p>
    </div>
}

export default ModuleInCreation