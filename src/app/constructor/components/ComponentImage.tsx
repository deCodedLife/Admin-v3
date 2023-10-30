import { useField, useFormikContext } from "formik"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { KTSVG } from "../../../_metronic/helpers"
import { useIntl } from "react-intl"
import { getErrorToast } from "../helpers/toasts"
import { Carousel } from "react-bootstrap"
import ComponentButton from "./ComponentButton"
import ComponentDropdown from "./ComponentDropdown"
import { ComponentImageType } from "../../types/components"
import AvatarEditor from "react-avatar-editor"

const readImageAsData = (file: File) => {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
    })
}


const ComponentImageEditor: React.FC<{image: string}> = ({image}) => {
    const [border, setBorder] = useState(0)
    const [scale, setScale] = useState(1)
    const [rotate, setRotate] = useState(0)
    const ref = useRef<AvatarEditor | null>(null)
    return <>
    <AvatarEditor
    ref={ref}
    image={image}
    width={250}
    height={250}
    borderRadius={border}
    color={[0, 0, 0, 0.6]} // RGBA
    scale={scale}
    rotate={rotate}
    crossOrigin="use-credentials"
  />
  <div>
    <input type="range" value={border} min={0} max={180} step={1} onChange={event => setBorder(Number(event.currentTarget.value))}/>
    <label>border</label>
  </div>
  <div>
    <input type="range" value={scale} min={0} max={10} step={0.1} onChange={event => setScale(Number(event.currentTarget.value))}/>
    <label>scale</label>
  </div>
  <div>
    <input type="range" value={rotate} min={0} max={360} step={1} onChange={event => setRotate(Number(event.currentTarget.value))}/>
    <label>rotate</label>
  </div>
  <div>
    <ComponentButton type="custom" settings={{title: "get image", icon: "", background: "dark"}}  customHandler={() => ref ? console.log(ref.current?.getImage().toDataURL()) : null}/>
  </div>

    </>
}
const ComponentImage: React.FC<ComponentImageType> = ({ article, allowedFormats = [], is_multiply }) => {
    const intl = useIntl()
    const { setFieldValue } = useFormikContext<any>()
    const [field] = useField(article)

    //проверка на массовую загрузку
    const isMulti = Boolean(is_multiply)

    //Массив для отформатированных изображений
    const [imagePreview, setImagePreview] = useState<Array<string>>([])
    const haveUploadedImages = imagePreview.length

    //ссылка на скрытый инпут и обработчик нажатия
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleButtonClick = () => inputRef.current ? inputRef.current.click() : null

    //первичная установка превью 
    useEffect(() => {
        if (field.value) {
            setImagePreview(Array.isArray(field.value) ? field.value : [field.value])
        }
    }, [])

    //полноэкранный режим карусели изображений (галерея) и отключение скролла
    const [fullscreenCarousel, setFullscreenCarousel] = useState(false)
    useEffect(() => {
        document.body.style.overflow = fullscreenCarousel ? "hidden" : ""
        if (fullscreenCarousel) {

        }
    }, [fullscreenCarousel])

    //контроль индекса карусели
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };

    //обработчик закрытия галереи через Esc
    const closeFullscreenCarousel = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            setFullscreenCarousel(prev => prev ? !prev : prev)
        }
    }, [])
    useEffect(() => {
        document.addEventListener("keydown", closeFullscreenCarousel)
        return () => document.removeEventListener("keydown", closeFullscreenCarousel)
    }, []);

    //валидатор формата и загрузка изображений
    const validationUploadedFile = async (files: FileList | null) => {
        if (files?.length) {
            const ArrayFromFiles = isMulti ? Array.from(files) : [files[0]]
            const isFilesAsImages = ArrayFromFiles.every(file => file.type.includes("image"))
            const isImageFormatAllowed = allowedFormats.length ? ArrayFromFiles.every(file => allowedFormats.some(format => file.type.includes(format))) : true
            if (isFilesAsImages && isImageFormatAllowed) {
                const resolvedImagesPreviews = await Promise.all(ArrayFromFiles.map(file => readImageAsData(file)))
                const sourceValueClone = (field.value && isMulti) ? Array.isArray(field.value) ? [...field.value] : [field.value] : []
                const resolvedValues = sourceValueClone.concat(ArrayFromFiles)
                setFieldValue(article, resolvedValues)
                setImagePreview(prev => {
                    const previewsClone = [...prev]
                    const resolvedPreviews = isMulti ? previewsClone.concat(resolvedImagesPreviews) : resolvedImagesPreviews
                    return resolvedPreviews
                })

            } else {
                getErrorToast(intl.formatMessage({ id: "IMAGE.INCORRECT_FORMAT" }))
            }
        }
    }

    //обработчики загрузки через нажатие и drag'n'drop
    const handleUploadPhotoAsClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        validationUploadedFile(files)
    }
    const handleUploadPhotoAsDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.currentTarget.classList.remove("active")
        const files = event.dataTransfer.files
        validationUploadedFile(files)
    }
    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => event.currentTarget.classList.add("active")
    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
            return
        } else {
            event.currentTarget.classList.remove("active")
        }
    }

    //удаление фото
    const handleDeletePhoto = (index: number) => {
        const sourceValueClone = field.value ? Array.isArray(field.value) ? [...field.value] : [field.value] : []
        sourceValueClone.splice(index, 1)
        setFieldValue(article, sourceValueClone)
        setImagePreview(prev => {
            const previewsClone = [...prev]
            previewsClone.splice(index, 1)
            return previewsClone
        })
        setIndex(prev => prev === 0 ? prev : prev - 1)
        if (!sourceValueClone.length) {
            setFullscreenCarousel(false)
        }
    }

    return <div className="componentImage_container"
    >
        <div className={`componentImage_uploader ${imagePreview ? " withPreview" : ""}`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={event => event.preventDefault()}
            onDrop={handleUploadPhotoAsDrop}
        >
            {
                haveUploadedImages ? <ComponentButton
                    className="componentImage_uploadMoreButton"
                    type="custom"
                    settings={{ title: intl.formatMessage({ id: isMulti ? "IMAGE.UPLOAD_MORE" : "IMAGE.REFRESH_IMAGE" }), icon: "upload", background: "dark" }}
                    customHandler={handleButtonClick}
                    defaultLabel="icon" />
                    : null
            }
            {haveUploadedImages ? <Carousel
                activeIndex={index}
                onSelect={handleSelect}
                className={fullscreenCarousel ? "fullscreen" : ""}
                interval={null}
                controls={false}
                indicators={imagePreview.length > 1}
            >
                {imagePreview.map((image, index) => <Carousel.Item key={image + index}>

                    <div className="componentImage_imageContainer">
                        {
                            fullscreenCarousel ? <div className="componentImage_imageToolbar">
                                <ComponentDropdown buttons={[{
                                    type: "custom",
                                    settings: { title: intl.formatMessage({ id: "BUTTON.DELETE" }), icon: "", background: "dark" },
                                    customHandler: () => handleDeletePhoto(index)
                                }]} />
                                <ComponentButton
                                    type="custom"
                                    settings={{ title: intl.formatMessage({ id: "BUTTON.CLOSE" }), icon: "close", background: "dark" }}
                                    defaultLabel="icon"
                                    customHandler={() => setFullscreenCarousel(false)}
                                />
                            </div> : null
                        }

                        <img draggable={false} className="componentImage_image" src={image} alt="user_avatar" onClick={() => setFullscreenCarousel(true)} />
                    </div>

                </Carousel.Item>)}
            </Carousel>
                : <>
                    <button type="button" className="componentImage_uploaderButton" onClick={handleButtonClick}>
                        <KTSVG path='/media/crm/icons/upload.svg' />
                    </button>
                    <p className="componentImage_uploaderText">
                        {intl.formatMessage({ id: "IMAGE.DESCRIPTION" })}
                    </p>
                </>
            }
        </div>
        <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleUploadPhotoAsClick}
            multiple={isMulti}
        />
        {allowedFormats?.length ? <div className="componentImage_allowedFormats">
            {intl.formatMessage({ id: "IMAGE.ALLOWED_FORMATS" })} {allowedFormats.map((format, index, array) => <span
                className="componentImage_allowedFormat">{`${format}${index !== array.length - 1 ? ", " : "."}`}</span>)}
        </div> : null}
    </div>
}

export default ComponentImage