import { Col, Form } from "react-bootstrap"
import Skeleton from "react-loading-skeleton"

const SkeletonWidget: React.FC = props => {
    return <Form.Group className="moduleWidgets_widgetContainer active" as={Col} md={4}>

        <div className="moduleWidgets_widget card card-flush">
            <div className="moduleWidgets_widgetContent card-header">
                <div className='card-title flex-column mw-100'>
                    <div className="moduleWidgets_widgetValueContainer">
                        <span className="moduleWidgets_widgetValue"><Skeleton className="skeleton" height={34} width={120} /></span>
                    </div>
                    <span className='moduleWidgets_widgetDescription'><Skeleton className="skeleton" height={24} width={75} /></span>
                </div>
            </div>
        </div>

    </Form.Group>
}

export default SkeletonWidget