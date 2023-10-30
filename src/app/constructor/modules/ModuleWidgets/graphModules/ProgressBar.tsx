import React, { useMemo } from "react"
import { ModuleWidgetsProgressBarModule } from "../../../../types/modules"

const ProgressBarModule: React.FC<ModuleWidgetsProgressBarModule["settings"]> = ({ title, percent }) => {
    const progressBarColor = useMemo(() => {
        if (percent >= 100) {
            return "success"
        } else if (percent > 50) {
            return "warning"
        } else {
            return "danger"
        }
    }, [percent])
    return <div className="card-body">
        <div className='d-flex flex-column w-100'>
            <span className='text-dark me-2 fw-bold pb-3'>{title}</span>

            <div className='progress h-5px w-100'>
                <div
                    className={`progress-bar bg-${progressBarColor}`}
                    role='progressbar'
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    </div>
}

export default ProgressBarModule