import { useField, useFormikContext } from "formik"
import React, { useEffect, useRef, useState } from "react"
import { KTSVG } from "../../../_metronic/helpers"
import { useIntl } from "react-intl"
import { ComponentFileType } from "../../types/components"
import ComponentButton from "./ComponentButton"
import api from "../../api"

type TFile = { title: string, extension: string, path: string }

const readFileAsData = (file: File) => {
    return new Promise<TFile>(resolve => {
        const reader = new FileReader()
        const splitedByDotTitle = file.name.split(".")
        const title = file.name
        const extension = splitedByDotTitle[splitedByDotTitle.length - 1]
        reader.onload = () => {
            resolve({ title, extension, path: reader.result as string })
        }
        reader.readAsDataURL(file)
    })
}

const PreviewComponent: React.FC<{ file: TFile, handleDelete: () => void }> = ({ file, handleDelete }) => {
    const [format, setFormat] = useState(file.extension)
    const intl = useIntl()

    return <div className="componentFile_preview">
        <KTSVG path={`/media/crm/assets/${format}.svg`} className="componentFile_previewIcon" onError={error => setFormat("other")} />
        <a
            className="componentFile_previewLink"
            title={file.title}
            href={file.path}
            target="_blank"
            download
        >{file.title ?? intl.formatMessage({ id: "FILE.DOWNLOAD" })}</a>
        <ComponentButton
            className="componentFile_deleteButton"
            type="custom"
            settings={{ title: intl.formatMessage({ id: "BUTTON.DELETE" }), icon: "trash", background: "danger" }}
            defaultLabel="icon"
            customHandler={handleDelete}
        />
    </div>
}

const ComponentFile: React.FC<ComponentFileType> = ({ article, is_multiply, object_id, request_object }) => {
    const intl = useIntl()
    const { setFieldValue } = useFormikContext<any>()
    const [field] = useField(article)

    //проверка на массовую загрузку
    const isMulti = Boolean(is_multiply)

    //Массив отформатированных файлов
    const [filePreview, setFilePreview] = useState<Array<TFile>>([])
    const haveUploadedFiles = filePreview.length

    //ссылка на скрытый инпут и обработчик нажатия
    const inputRef = useRef<HTMLInputElement | null>(null)
    const handleUploadAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault()
        return inputRef.current ? inputRef.current.click() : null
    }
    const handleUploadButtonClick = () => inputRef.current ? inputRef.current.click() : null

    //первичная установка превью 
    useEffect(() => {
        if (field.value) {
            setFilePreview(Array.isArray(field.value) ? field.value : [field.value])
        }
    }, [])

    //валидатор формата и загрузка изображений
    const validationUploadedFile = async (files: FileList | null) => {
        if (files?.length) {
            const ArrayFromFiles = isMulti ? Array.from(files) : [files[0]]
            const resolvedFilesPreviews = await Promise.all(ArrayFromFiles.map(file => readFileAsData(file)))
            const sourceValueClone = (field.value && isMulti) ? Array.isArray(field.value) ? [...field.value] : [field.value] : []
            const resolvedValues = sourceValueClone.concat(ArrayFromFiles)
            setFieldValue(article, resolvedValues)
            setFilePreview(prev => {
                const previewsClone = [...prev]
                const resolvedPreviews = isMulti ? previewsClone.concat(resolvedFilesPreviews) : resolvedFilesPreviews
                return resolvedPreviews
            })

        }
    }

    //обработчики загрузки через нажатие и drag'n'drop
    const handleUploadFileAsClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        validationUploadedFile(files)
    }
    const handleUploadFileAsDrop = (event: React.DragEvent<HTMLDivElement>) => {
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

    //удаление файла
    const handleDeleteFile = async (index: number) => {
        const sourceValueClone = field.value ? Array.isArray(field.value) ? [...field.value] : [field.value] : []
        const currentFile = sourceValueClone[index]
        if ("title" in currentFile && "extension" in currentFile && request_object && object_id) {
            await api("files", "remove", {object: request_object, row_id: object_id, title: `${currentFile.title}.${currentFile.extension}`})
        }
        sourceValueClone.splice(index, 1)
        setFieldValue(article, sourceValueClone)
        setFilePreview(prev => {
            const previewsClone = [...prev]
            previewsClone.splice(index, 1)
            return previewsClone
        })
    }

    return <div className="componentFile_container"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={event => event.preventDefault()}
        onDrop={handleUploadFileAsDrop}
    >
        {
            haveUploadedFiles ? <>
                {filePreview.map((file, index) => <PreviewComponent key={file.path + index} file={file} handleDelete={() => handleDeleteFile(index)} />)}
                <div className="componentFile_uploadMoreButtonContainer">
                    <ComponentButton
                        className="componentFile_uploadMoreButton"
                        type="custom"
                        settings={{ title: intl.formatMessage({ id: isMulti ? "FILE.UPLOAD_MORE" : "FILE.REFRESH_FILE" }), icon: "upload", background: "light" }}
                        customHandler={handleUploadButtonClick} />
                </div>
            </> :
                <p className="componentFile_uploaderText">
                    {intl.formatMessage({ id: "FILE.DRAG" })}
                    <a className="componentFile_uploadLink" onClick={handleUploadAnchorClick}>{intl.formatMessage({ id: "FILE.SELECT_LINK" })}</a>
                    {intl.formatMessage({ id: "FILE.FILE_DESCRIPTION" })}
                </p>

        }
        <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleUploadFileAsClick}
            multiple={isMulti}
        />
    </div>
}

export default ComponentFile