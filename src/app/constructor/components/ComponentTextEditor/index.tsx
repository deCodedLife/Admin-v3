import { Editor } from "@tinymce/tinymce-react"
import { useField, useFormikContext } from "formik"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import ReactSignatureCanvas from "react-signature-canvas"
import ComponentButton from "../ComponentButton"
import { getApiUrl, uploadFiles } from "../../../api"
import md5 from "md5"
import { useIntl } from "react-intl"
import setModalIndex from "../../helpers/setModalIndex"
import { unescape } from "lodash"
import { TComponentTextEditor } from "./_types"



const ComponentTextEditor: React.FC<TComponentTextEditor> = ({ article, variables = [], tableVariables = [] }) => {
    const intl = useIntl()
    const [field, meta] = useField(article)
    const isError = Boolean(meta.error && meta.touched)
    const { setFieldValue } = useFormikContext()
    const { value } = field
    const editorEventsRef = useRef<any>(null)
    const signatureEventsRef = useRef<any>(null)
    const [showSignatureModal, setShowSignatureModal] = useState(false)

    const toolbar =
        `undo redo | fontfamily fontsizeinput blocks | bold italic | 
  alignleft aligncenter alignright alignjustify | 
  bullist numlist outdent indent  | table code | fullscreen help | signature | ${variables.length ? "variables" : ""} | ${tableVariables.length ? "variablesTable" : ""} | image`

    const plugins = `autoresize fullscreen advlist autolink lists link image 
  charmap print preview anchor help search 
  replace visualblocks code 
  insertdatetime media table paste wordcount link signature | ${variables.length ? "variables" : ""} | ${tableVariables.length ? "variablesTable" : ""}`

    //хак для повторной инициализации редактора
    const editorKey = useMemo(() => toolbar.length + plugins.length, [toolbar, plugins])

    const handleChange = (value: string) => {
        return setFieldValue(article, value)
    }
    const setup = useCallback((editor: any) => {
        const openVariablesModal = () => {
            return editor.windowManager.open({
                title: intl.formatMessage({ id: "TEXT_EDITOR.SELECT_VARIABLE" }),
                body: {
                    type: 'tabpanel',
                    tabs: Array.isArray(variables) ? variables.map((table: any) => {
                        return {
                            name: table.name ?? table.title,
                            title: table.title,
                            items: Array.isArray(table.variables) ? table.variables.map((variable: any) => {
                                return {
                                    type: "button",
                                    text: variable.title,
                                    name: `{${variable.variable}}`,
                                }
                            }) : [],
                        }
                    }) : []
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: intl.formatMessage({ id: "BUTTON.CLOSE" })
                    }
                ],
                onAction: (api: any, details: any) => {
                    editor.insertContent(details.name);
                    api.close();
                },
            });
        };

        const openVariablesTableModal = () => {
            return editor.windowManager.open({
                title: intl.formatMessage({ id: "TEXT_EDITOR.SELECT_VARIABLES" }),
                body: {
                    type: 'tabpanel',
                    tabs: Array.isArray(tableVariables) ? tableVariables.map((table: any) => {
                        return {
                            name: table.name ?? table.title,
                            title: table.title,
                            items: Array.isArray(table.variables) ? table.variables.map((variable: any) => {
                                return {
                                    type: "checkbox",
                                    label: variable.title,
                                    name: `${variable.title}__{${variable.variable}}`,
                                }
                            }) : [],
                        }
                    }) : []
                },
                buttons: [
                    {
                        type: 'cancel',
                        text: intl.formatMessage({ id: "BUTTON.CLOSE" })
                    },
                    {
                        type: 'submit',
                        text: intl.formatMessage({ id: "BUTTON.SUBMIT" })
                    }
                ],
                onSubmit: (api: any, details: any) => {
                    const checkedVariables = Object.entries<boolean>(api.getData())
                        .filter(([variable, isChecked]) => isChecked)
                        .map(([variable, isChecked]) => {
                            const [columnTitle, pureVariable] = variable.split("__")
                            const variableType = pureVariable.split(":")[0].split("/")[1]
                            return {
                                column: columnTitle,
                                variable: pureVariable,
                                type: variableType
                            }
                        })

                    if (checkedVariables.length) {

                        const parentModalApi = api
                        const tableVariablesTypesList = tableVariables.map(type => {
                            const value = type.variables[0].variable.split(":")[0].split("/")[1]
                            return {
                                text: type.title,
                                value
                            }
                        })
                        editor.windowManager.open({
                            title: "Уточнения",
                            body: {
                                type: 'panel',
                                items: [{
                                    type: 'selectbox', // component type
                                    name: 'type', // identifier
                                    label: 'Перечислять',
                                    size: 1, // number of visible values (optional)
                                    items: tableVariablesTypesList
                                },
                                {
                                    type: "checkbox",
                                    label: "Указывать № п/п",
                                    name: `serial`,
                                },
                                ]
                            },
                            buttons: [
                                {
                                    type: 'cancel',
                                    text: intl.formatMessage({ id: "BUTTON.CLOSE" })
                                },
                                {
                                    type: 'submit',
                                    text: intl.formatMessage({ id: "BUTTON.SUBMIT" })
                                }
                            ],
                            onSubmit: (api: any, details: any) => {
                                const values = api.getData() as { type: string, serial: boolean }
                                const { type, serial } = values
                                const table = `<table style="border-collapse: collapse; width: 100%;" border="1">
                                <thead>
                                <tr>
                                ${serial ? `<th style="text-align: center">№</th>` : ""}
                                ${checkedVariables.map(variable => `<th style="text-align: center">${variable.column}</th>`).join("")}
                                </tr>
                                </thead>
                                <tbody>
                                <tr data-type="${type}"  data-dynamic="true">
                                ${serial ? `<td style="text-align: center">{index}</td>` : ""}
                                ${checkedVariables.map(variable => `<td style="text-align: center">${variable.variable}</td>`).join("")}
                                </tr>
                                </tbody>
                                </table>`
                                editor.insertContent(table);
                                api.close()
                                parentModalApi.close()
                            },
                        });
                    } else {
                        api.close();
                    }

                },
            });
        };
        editor.editorManager.PluginManager.add('signature', (editor: any) => {
            editor.ui.registry.addButton('signature', {
                text: intl.formatMessage({ id: "TEXT_EDITOR.SIGNATURE" }),
                tooltip: intl.formatMessage({ id: "TEXT_EDITOR.SIGNATURE" }),
                onAction: () => {
                    setShowSignatureModal(true)
                    editorEventsRef.current = editor
                }
            });
        });
        editor.editorManager.PluginManager.add('variables', (editor: any) => {
            editor.ui.registry.addButton('variables', {
                text: intl.formatMessage({ id: "TEXT_EDITOR.VARIABLES" }),
                tooltip: intl.formatMessage({ id: "TEXT_EDITOR.VARIABLES" }),
                onAction: () => {
                    openVariablesModal()
                }
            });
        });
        editor.editorManager.PluginManager.add('variablesTable', (editor: any) => {
            editor.ui.registry.addButton('variablesTable', {
                text: intl.formatMessage({ id: "TEXT_EDITOR.DYNAMIC_TABLE" }),
                tooltip: intl.formatMessage({ id: "TEXT_EDITOR.DYNAMIC_TABLE" }),
                onAction: () => {
                    openVariablesTableModal()
                }
            });
        });
    }, [variables])

    const handleCloseSignatureModal = () => {
        setShowSignatureModal(false)
        editorEventsRef.current = null
    }
    const handleAppendSignature = useCallback(() => {
        if (signatureEventsRef.current && editorEventsRef.current) {
            const image = signatureEventsRef.current.getTrimmedCanvas().toDataURL('image/png')
            const imageElement = `<img width=200 height=100 src=${image}>`
            editorEventsRef.current.insertContent(imageElement);
            handleCloseSignatureModal()
        }
    }, [])

    const handleImageUpload = async (blobInfo: any, progress: any) => {
        const image = blobInfo.blob()
        if (!image.name) {
            return
        }
        const hashedImageName = md5(`${image.name.replace(/\.\w+/, "")}_${Math.random().toFixed(3)}`)
        const value = {
            image,
            scheme_name: "documents",
            image_key: hashedImageName
        }
        const { data, status } = await uploadFiles("admin", "image-load", value)
        if (status !== 200) {
            throw new Error(intl.formatMessage({ id: "TEXT_EDITOR.UPLOAD_IMAGE_ERROR" }))
        } else {
            const resolvedUrl = getApiUrl() + data
            return resolvedUrl
        }
    }

    return <div className={`componentTextEditor${isError ? " invalid" : ""}`}>
        <Editor
            key={editorKey}
            apiKey="xuv4iq7uob27qh8ygu3yntok0c8qi8dirr9a9ze7m3g0nowb"
            value={unescape(value)}
            plugins={plugins}
            toolbar={toolbar}
            init={{
                setup,
                browser_spellcheck: true,
                min_height: 500,
                max_height: 500,
                menubar: false,
                fontsize_formats : "10px 12px 14px 16px 18px 20px 22px 24px 26px 28px 30px",
                content_style: "body { font-size: 20px;}",
                //@ts-ignore
                images_upload_handler: handleImageUpload,
            }}
            onEditorChange={handleChange}

        />
        <Modal
            show={showSignatureModal}
            onHide={handleCloseSignatureModal}
            size="lg"
            backdropClassName="componentTextEditor_signatureModalBackdrop"
            className="componentTextEditor_signatureModal"
            onEntering={setModalIndex}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {intl.formatMessage({ id: "TEXT_EDITOR.SIGNATURE" })}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ReactSignatureCanvas
                    ref={ref => signatureEventsRef.current = ref}
                    penColor='black'
                    canvasProps={{ className: "componentTextEditor_signature" }} />
            </Modal.Body>
            <Modal.Footer>
                <div className="componentButton_container">
                    <ComponentButton
                        type="custom"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.CANCEL" }), icon: "", background: "light" }}
                        customHandler={handleCloseSignatureModal}
                    />
                    <ComponentButton
                        type="custom"
                        settings={{ title: intl.formatMessage({ id: "BUTTON.SUBMIT" }), icon: "", background: "dark" }}
                        customHandler={handleAppendSignature}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    </div>
}

export default ComponentTextEditor
