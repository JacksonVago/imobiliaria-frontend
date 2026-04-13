//import { saveAs } from 'file-saver';
import { pdf, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import { getEnderecoFormatado } from '@/helpers/get-endereco-formatado';
import logo from '../assets/logo-molina.png';
//import PoppinsBold from '../fonts/Poppins-Bold.ttf';
import PoppinsRegular from '../fonts/Poppins-Regular.ttf';
import moment from 'moment';

Font.register({
    family: 'Poppins',
    src: PoppinsRegular
});

export const real = new Intl.NumberFormat('pr-BR', {
    style: 'currency',
    currency: 'BRL',
});

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFF',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft: 50,
        paddingRight: 50,
        paddingBottom: 10,
        lineHeight: 1,
    },
    image: {
        width: 100, // Set desired width
        height: 45, // Set desired height
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 8,
    },
    title: {
        flexDirection: "row",
        textAlign: "center",
        fontFamily: "Poppins",
        fontSize: 10
    }
});

const borderColorCab = "#00519C";

const stylesCab = StyleSheet.create({
    tableContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 24,
        borderWidth: 1,
        borderColor: "#3778C2"
    },
    container: {
        flexDirection: "row",
        borderBottomColor: "#00519C",
        backgroundColor: "#00519C",
        color: "#fff",
        borderBottomWidth: 1,
        alignItems: "center",
        height: 24,
        textAlign: "center",
        fontWeight: "bold",
        flexGrow: 1,
        fontSize: 9
    },
    imovel: {
        width: "45%",
        borderRightColor: borderColorCab,
        borderRightWidth: 1
    },
    aluguel: {
        width: "15%",
        borderRightColor: borderColorCab,
        borderRightWidth: 1
    },
    taxa: {
        width: "20%",
        borderRightColor: borderColorCab,
        borderRightWidth: 1
    },
    repasse: {
        width: "20%"
    }
});

const borderColor = "#3778C2";

const stylesTab = StyleSheet.create({
    row: {
        flexDirection: "row",
        borderBottomColor: "#3778C2",
        borderBottomWidth: 1,
        alignItems: "center",
        height: 14,
        fontSize: 7
    },
    imovel: {
        width: "45%",
        textAlign: "left",
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8
    },
    aluguel: {
        width: "15%",
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: "right",
        paddingRight: 8
    },
    taxa: {
        width: "20%",
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: "right",
        paddingRight: 8
    },
    repasse: {
        width: "20%",
        textAlign: "right",
        paddingRight: 8
    }
});

export const relatorioRepasse = async (fileName: string, data: any) => {
    console.log(data);
    const blob = await pdf((
        <Document>
            <Page size='A4' style={styles.page}>
                <View style={styles.header}>
                    <View>
                        <Image
                            style={styles.image}
                            src={logo}>

                        </Image>
                    </View>
                    <View>
                        <Text>
                            Data: {moment(new Date()).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.title}>
                        Relatório de Repasses
                    </Text>
                </View>
                <View style={stylesCab.tableContainer}>
                    {/* Invoice Table Header */}
                    <View style={stylesCab.container}>
                        <Text style={stylesCab.imovel}>Imóvel</Text>
                        <Text style={stylesCab.aluguel}>Valor Aluguel</Text>
                        <Text style={stylesCab.taxa}>Taxa</Text>
                        <Text style={stylesCab.repasse}>Valor do Repasse</Text>
                    </View>

                    {/*Produtos*/}
                    {data.map((item: any) => (
                        <View style={stylesTab.row} key={item.id.toString()} wrap={false}>
                            <Text style={stylesTab.imovel}>{(item.locacao?.imovel?.proprietarios ? item.locacao?.imovel?.proprietarios[0].pessoa?.nome + ' - ' : '') + getEnderecoFormatado(item.locacao?.imovel?.endereco)}</Text>
                            <Text style={stylesTab.aluguel}>{real.format(item.locacao ? item.locacao.valorAluguel : 0)}</Text>
                            <Text style={stylesTab.taxa}>{`${(item.locacao.imovel?.porcentagemLucroImobiliaria ? item.locacao.imovel?.porcentagemLucroImobiliaria : 0)} %`}</Text>
                            <Text style={stylesTab.repasse}>{real.format(item.locacao?.imovel
                                ?
                                item.locacao.valorAluguel * ((100 - item.locacao.imovel?.porcentagemLucroImobiliaria) / 100)
                                :
                                0)}</Text>
                        </View>
                    ))}
                </View>
                {/* {data.map((item: any, index: number) => (
                    <View key={item} wrap={false}>
                        <View>
                            <Text>{item.str_descricao}</Text>
                            <Text>{'\n'}</Text>
                        </View>
                    </View>
                ))}

                <Text
                    style={styles.section}
                    render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )}
                    fixed
                /> */}
            </Page>
        </Document>
    )).toBlob();

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName; // Or 'image.png', 'document.pdf', etc.    
    link.click();
};
