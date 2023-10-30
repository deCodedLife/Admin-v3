import React, { useCallback, useState } from "react"
import { Modal } from "react-bootstrap"
import useItem from "../../api/hooks/useItem"
import { ModuleNewsCardType, ModuleNewsType } from "../../types/modules"
import ComponentButton from "../components/ComponentButton"
import parse from "html-react-parser"
import { useIntl } from "react-intl"
import { KTSVG } from "../../../_metronic/helpers"
import setModalIndex from "../helpers/setModalIndex"

const NewsCard: React.FC<ModuleNewsCardType> = ({ image, title, body, preview, handleNewsClick }) => {
    const intl = useIntl()
    return <div className="moduleNews_newsCard">
        <div className="overlay moduleNews_newsCardOverlay">
            <div className="overlay-wrapper">
                <img className="moduleNews_newsCardImage" src={image} alt="news image" />
            </div>
            <div className="overlay-layer bg-dark bg-opacity-50">
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "NEWS.SHOW_NEWS_BUTTON" }), background: "dark", icon: "" }}
                    customHandler={() => handleNewsClick(title, image, body)}
                />
            </div>
        </div>
        <h4 className="moduleNews_newsCardTitle" onClick={() => handleNewsClick(title, image, body)}>{title}</h4>
        <div className="moduleNews_newsCardBody">{preview}</div>
    </div>
}

const ModuleNews: React.FC<ModuleNewsType> = ({ settings }) => {
    const intl = useIntl()
    const { object, property_image, property_title, property_body, property_preview } = settings
    const { data, isFetching } = useItem(object, {})
    const [showNews, setShowNews] = useState(false)
    const [selectedNews, setSelectedNews] = useState<{ title: string, image: string, body: string } | null>(null)
    const showEmptyNewsContainer = !isFetching && !data?.length

    const handleNewsClick = useCallback((title: string, image: string, body: string) => {
        setSelectedNews({ title, image, body })
        setShowNews(true)
    }, [])
    const handleCloseNewsModal = () => {
        setShowNews(false)
        setTimeout(() => setSelectedNews(null), 300)
    }

    return <>
        <div className="moduleNews">
            <div className="card">
                <div className="moduleNews_newsCardsContainer card-body">
                    {data?.map(item => {
                        const image = item[property_image]
                        const title = item[property_title]
                        const body = item[property_body]
                        const preview = item[property_preview]
                        const key = image + title + body
                        return <NewsCard key={key} image={image} title={title} body={body} preview={preview} handleNewsClick={handleNewsClick} />
                    })}
                    {
                        showEmptyNewsContainer ? <div className="moduleNews_emptyNewsContainer">
                            <KTSVG svgClassName="" className="moduleNews_emptyNewsImage" path="media/crm/icons/publication.svg" />
                            <p className="moduleNews_emptyNewsDescription">
                                {intl.formatMessage({ id: "NEWS.EMPTY_NEWS" })}
                            </p>
                        </div> : null
                    }
                </div>
            </div>
        </div>
        <Modal
            size="lg"
            show={showNews}
            onHide={handleCloseNewsModal}
            onEntering={setModalIndex}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {selectedNews?.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="scroll-y">
                <img className="moduleNews_newsModalImage" src={selectedNews?.image} alt="news image" />
                <p className="moduleNews_newsModalBody">{parse(selectedNews?.body ?? "")}</p>
            </Modal.Body>
            <Modal.Footer>
                <ComponentButton
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: "BUTTON.CLOSE" }), background: "dark", icon: "" }}
                    customHandler={handleCloseNewsModal}
                />
            </Modal.Footer>
        </Modal>
    </>
}

export default ModuleNews