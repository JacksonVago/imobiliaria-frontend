import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ROUTE } from '@/enums/routes.enum'
import { toast } from '@/hooks/use-toast'
import api from '@/services/axios/api'
import { queryClient } from '@/services/react-query/query-client'
import { transformNullToUndefined } from '@/utils/transform-null-to-undefined'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Edit, Link2Off, Mail, Phone,  Trash2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
//import { PessoaStatus } from '@/enums/pessoal/status-pesoa'
//import { Pessoa } from '@/interfaces/pessoa'
import { PropImovelSchema, propImoveSchema, 
  //ProprietarioSchema, 
  proprietarioSchema } from '@/schemas/proprietario.schema'
/*import { ImovelStatus } from '@/enums/imovel/enums-imovel'
import { Imovel } from '@/interfaces/imovel'
import { Proprietario } from '@/interfaces/proprietario'
import { GarantiaLocacao, LocacaoStatus } from '@/enums/locacao/enums-locacao'*/
import { locacaoSchema, LocacaoSchema } from '@/schemas/locacao.schema'
import { Locacao } from '@/interfaces/locacao'
import { LocacaoFormContent, LocacaoFormRoot } from '../components/locacao-form';
import { useMediaQuery } from 'react-responsive';
import moment from 'moment';
//import { Locatario } from '@/interfaces/locatario';

// Mock data for demonstration
/*const locacao = {
  id: 'cli001',
  nome: 'Ana Oliveira',
  documento: '123.456.789-00',
  profissao: 'Professora',
  estadoCivil: 'CASADO',
  email: 'ana.oliveira@email.com',
  telefone: '(11) 98765-4321',
  statu: PessoaStatus.ATIVA,
  endereco: {
    rua: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Jardim Primavera',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567'
  },
  locacoes: [
    {
      id: 'rent001',
      imovel: 'Apartamento Centro',
      valor_aluguel: 1500,
      dataInicio: '2023-01-01',
      dataFim: '2024-01-01',
      status: 'Ativo'
    },
    {
      id: 'rent002',
      imovel: 'Casa de Praia',
      valor_aluguel: 2000,
      dataInicio: '2023-06-01',
      dataFim: null,
      status: 'Ativo'
    },
    {
      id: 'rent003',
      imovel: 'Kitnet Universitária',
      valor_aluguel: 800,
      dataInicio: '2022-03-01',
      dataFim: '2023-02-28',
      status: 'Encerrado'
    }
  ]
}*/

const fetchDocumentFiles = async (documents: Locacao['documentos']) => {
  const documentFilesPromises =
    documents?.map(async (doc) => {
      try {
        const response = await fetch(
          'https://jrseqfittadsxfbmlwvz.supabase.co/storage/v1/object/public/' + doc.url
        )
        if (!response.ok) {
          throw new Error('Erro ao buscar documento')
        }
        const blob = await response.blob()
        const file = new File([blob], doc?.name || 'documento', { type: doc?.type })
        return {
          file,
          preview: URL.createObjectURL(file),
          name: doc.name,
          type: doc.type,
          // size: doc?.size,
          id: doc.id
        }
      } catch (error) {
        console.error(error)
        return null
      }
    }) || []
  const resolvedFiles = await Promise.all(documentFilesPromises)
  return resolvedFiles.filter(Boolean)
}

export const DetalhesLocacaoForm = ({
  //id,
  desvincularlocacaoImovel
}: {
  //id: number
  disabled?: boolean
  desvincularlocacaoImovel?: () => void
}) => {
    
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  /*const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  const isMobile = useMediaQuery({ query: '(min-width: 400px)' })*/

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = React.useState(false)
  const disabled = isEditingPersonalInfo

  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;
  //const params = useParams();

  console.log(id);
  const { data: locacao } = useQuery({
    queryKey: ['locacao', id],
    queryFn: async () => {
      const { data } = await api.get<Locacao>(`/locacoes/${id}`)
      console.log(data);
      return data
    },
    enabled: !!id
  })

  const { data: documentFilesData = [], isSuccess: isSuccessDocuments } = useQuery({
    queryKey: ['documentFiles', id, locacao?.documentos],
    queryFn: () => fetchDocumentFiles(locacao?.documentos),
    enabled: !!locacao?.documentos?.length
  })

  const documentFiles = React.useMemo(() => documentFilesData, [isSuccessDocuments])

  /*const createlocacao = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.post<Locacao>(`/locacoes`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['locacao', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })*/

  const updatelocacao = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<Locacao>(`/locacoes/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['locacao', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })

  /*const deletelocacaoMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/locacoes/${id}`)
    },
    onSuccess: () => {
      ;['locacao', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      toast({
        title: 'locacao excluído com sucesso',
        description: `locacao excluído com sucesso`
      })

      navigate(ROUTE.LOCACOES)
    }
  });*/

  const onSubmitLocacaoData = async (data: LocacaoSchema) => {
    try {
      console.log(new Date());
      const formData = new FormData()

      formData.append('dataInicio', moment(data.dataInicio).format('YYYY-MM-DD'));
      formData.append('dataFim', moment(data.dataFim).format('YYYY-MM-DD'));
      formData.append('valor_aluguel', (data.valor_aluguel ? data.valor_aluguel.toString() : '0'));
      formData.append('status', data.status);
      formData.append('imovelId', (data.imovelId ? data.imovelId.toString() : '0'));
      formData.append('dia_vencimento', (data.dia_vencimento ? data.dia_vencimento.toString() : ""));
      formData.append('garantiaLocacaoTipo', data.garantiaLocacaoTipo);
      formData.append('fiador', (data.fiadores ? data.fiadores.map(x => { return x.id; }).toString() : ''));
      formData.append('numeroTitulo', (data.tituloCap?.numeroTitulo ? data.tituloCap?.numeroTitulo.toString() : '0'));
      formData.append('numeroSeguro', (data.seguroFianca?.numeroSeguro ? data.seguroFianca?.numeroSeguro.toString() : '0'));
      formData.append('valorDeposito', (data.depCalcao?.valorDeposito ? data.depCalcao?.valorDeposito.toString() : '0'));
      formData.append('quantidadeMeses', (data.depCalcao?.quantidadeMeses ? data.depCalcao?.quantidadeMeses.toString() : '0'));
      formData.append('pessoaId', (data.locatarios ? data.locatarios.map(x => { return x.id; }).toString() : ''));

      console.log(new Date());

      await updatelocacao.mutateAsync(formData)
      console.log(new Date());

      toast({
        title: 'locacao atualizado com sucesso',
        description: `locacao atualizado com sucesso`
      })
    } catch (error) {
      console.log(error);
      toast({
        title: 'Erro ao atualizar locacao',
        description: 'Ocorreu um erro ao tentar atualizar o locacao. Tente novamente.'
      })
    }
  }

  //default values
  const enderecoData = transformNullToUndefined(locacao?.imovel?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(locacao || {}),
      dataInicio: moment(locacao?.dataInicio).format('YYYY-MM-DD'),
      dataFim: moment(locacao?.dataFim).format('YYYY-MM-DD'),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
      documentos: documentFiles?.filter((doc) => doc !== null),
      garantiaLocacaoTipo: locacao?.garantiaLocacaoTipo,
      locatarios: locacao?.locatarios?.map((locatario) => {
        return { nome: locatario.pessoa?.nome, id: locatario.pessoa?.id }
      }),      
      fiadores: locacao?.fiadores ? locacao?.fiadores?.map((fiador) => {
        return { nome: fiador.pessoa?.nome, id: fiador.pessoa?.id }
      }) : undefined,
      imoveis: [{ nome: locacao?.imovel?.description, id: locacao?.imovel?.id }],
      tituloCap : (locacao?.garantiaTituloCapitalizacao ? {numeroTitulo : locacao?.garantiaTituloCapitalizacao?.numeroTitulo } : undefined),
      seguroFianca : locacao?.garantiaSeguroFianca?  {numeroSeguro : locacao?.garantiaSeguroFianca?.numeroSeguro } : undefined,
      depCalcao : locacao?.garantiaDepositoCalcao ? {valorDeposito : locacao?.garantiaDepositoCalcao?.quantidadeMeses, quantidadeMeses: locacao?.garantiaDepositoCalcao?.valorDeposito } : undefined,
    }),
    [locacao, documentFiles]
  )
  
  React.useEffect(() => {
    if (locacao) locacaoMethods.reset(defaultValues)
      console.log(defaultValues);
  }, [defaultValues])

  //react hook form

  const locacaoMethods = useForm<LocacaoSchema>({
    resolver: zodResolver(locacaoSchema),
    defaultValues,
    mode: 'onBlur'
  })

  React.useEffect(() => {
    if (locacao) {
      locacaoMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
  }, [id, locacao, documentFiles])

  /*const handleDeleteProprietario = () => {
    deletelocacaoMutation.mutate()
  }*/

  const hasLocatario = !!locacao?.locatarios?.length;

  console.log(locacaoMethods.formState.errors);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-1xl">
          <span>
            Informação da Locação
            {desvincularlocacaoImovel && hasLocatario && (
              <Button variant="destructive" type="button" onClick={desvincularlocacaoImovel}>
                <Link2Off className="mr-2 h-4 w-4" />
                Desvincular Propriedade
              </Button>
            )}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditingPersonalInfo(!isEditingPersonalInfo)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {isEditingPersonalInfo ? 'Cancelar' : 'Editar'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <LocacaoFormRoot
          createLocacaoMethods={locacaoMethods}
          onSubmitLocacaoData={onSubmitLocacaoData}
        >
          <LocacaoFormContent createLocacaoMethods={locacaoMethods} disabled={!disabled} />
          <div className="mt-4">
            {disabled && (
              <Button

                className={(isPortrait ? "" : "w-full")}
                disabled={
                  !locacaoMethods.formState.isDirty
                  //|| !locacaoMethods.formState.isValid
                }
              >
                Salvar Alterações
              </Button>
            )}
          </div>
        </LocacaoFormRoot>
      </CardContent>
    </Card>
  )
}

export default function DetalhesLocacao() {
  const navigate = useNavigate()
  //const [formInitialized, setFormInitialized] = React.useState(false) // Controle de inicialização
  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;
  /*const [proImovelId, setPropImovelId] = React.useState<number>(0);
  const [cotaImovel, setCotaImovel] = React.useState<number>(0);
  const [selImovel, setSelImovel] = React.useState('');
  const [proImovelIdAlt, setPropImovelIdAlt] = React.useState<number>(0);
  const [cotaImovelAlt, setCotaImovelAlt] = React.useState<number>(0);
  const [selImovelAlt, setSelImovelAlt] = React.useState('');
  const [propEdit, setPropEdit] = React.useState<Proprietario>();
  const [locEdit, setLocEdit] = React.useState<Locacao>();
  const [selGarantia, setSelGarantia] = React.useState<GarantiaLocacao>();
  const [selFiador, setSelFiador] = React.useState<boolean>(false);*/

  const { data: locacao } = useQuery({
    queryKey: ['locacao', id],
    queryFn: async () => {
      const { data } = await api.get<Locacao>(`/locacoes/${id}`)
      return data
    },
    enabled: !!id
  })

  console.log(id);
  console.log(locacao);

  /*let imovelStatus = ImovelStatus.DISPONIVEL;

  const { data: imoveisLocacao } = useQuery({
    queryKey: ['locacoes', imovelStatus],
    queryFn: async () => {
      const { data } = await api.get<Imovel[]>(`/imoveis/locacao/?imovelStatus=${imovelStatus}`)
      return data
    },
  })

  const { data } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await api.get<Locacao[]>(`/locacoes`)
      return response.data;
    },
  });*/

  //const fiadores = data?.data || [];

  const { data: documentFilesData = [], isSuccess: isSuccessDocuments } = useQuery({
    queryKey: ['documentFiles', id, locacao?.documentos],
    queryFn: () => fetchDocumentFiles(locacao?.documentos),
    enabled: !!locacao?.documentos?.length
  })

  const documentFiles = React.useMemo(() => documentFilesData, [isSuccessDocuments])

  //default values
  const enderecoData = transformNullToUndefined(locacao?.imovel?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(locacao || {}),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
      documentos: documentFiles?.filter((doc) => doc !== null)
    }),
    [locacao, documentFiles]
  )

  /*const updatelocacao = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<Locacao>(`/locacoes/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['locacao', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })*/

  const deletelocacaoMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/locacoes/${id}`)
    },
    onSuccess: () => {
      ;['locacao', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      toast({
        title: 'locacao excluída com sucesso',
        description: `locacao excluída com sucesso`
      })

      navigate(ROUTE.LOCACOES);
    }
  })

  //react hook form
  const locacaoMethods = useForm<LocacaoSchema>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues,
    mode: 'onBlur'
  })

  const locacaoProp = useForm<PropImovelSchema>({
    resolver: zodResolver(propImoveSchema),
  });

  const locacaoPropAlt = useForm<PropImovelSchema>({
    resolver: zodResolver(propImoveSchema),
  });

  //Lista de imóveis
  /*const locacaoImoveis = useFieldArray({
    control: locacaoMethods.control,
    name: 'imoveis'
  });

  //Lista de locatários
  const locacaoLocatarios = useFieldArray({
    control: locacaoMethods.control,
    name: 'locatarios'
  });

  const locacaoFiadores = useFieldArray({
    control: locacaoMethods.control,
    name: 'fiadores'
  });

  const imovelLocAlt = useForm<LocacaoSchema>({
    resolver: zodResolver(locacaoSchema),
    mode: "onBlur"
  });*/

  React.useEffect(() => {
    if (locacao) {
      locacaoMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
    locacaoProp.reset();
    locacaoPropAlt.reset();
  }, [id, locacao, documentFiles])

  const handleDeleteProprietario = () => {
    deletelocacaoMutation.mutate()
  }

  /*function handleSubmitPropriedade(data: PropImovelSchema) {
    console.log(data);

    const formData = new FormData();

    formData.append('pessoaId', (id!! ? id.toString() : '0'));
    formData.append('cota_imovel', (data.cota_imovel ? data.cota_imovel.toString() : ""));
    formData.append('imovelId', (data.imovelId ? data.imovelId.toString() : ""));

    //Gravar dados das propriedades
    api.put(`proprietarios/${id}/vincular-imovel/${data.imovelId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).
      then(result => {
        toast({
          title: 'Propriedade adicionada com sucesso',
          description: `Propriedade adicionada com sucesso`
        });
      });


  }

  const handlerNewProp = () => {
    setCotaImovel(0);
    setPropImovelId(0);
    setSelImovel('');
    locacaoProp.reset();
    locacaoProp.setValue('pessoaId', id!)
  }

  const handlerEditPropriedade = (locatario: Locatario) => {
    if (locatario) {
      setCotaImovelAlt(0);
      setPropImovelIdAlt(0);
      setSelImovelAlt('');
      locacaoPropAlt.reset();
      setPropEdit(proprietario);
      setCotaImovelAlt(proprietario.cota_imovel);
      setSelImovelAlt(proprietario.imovelId.toString());
      setPropImovelIdAlt(proprietario.imovelId);
      locacaoPropAlt.setValue('imovelId', proprietario.imovelId);
      locacaoPropAlt.setValue('cota_imovel', proprietario.cota_imovel);
    }
  }

  const handleDeletePropriedade = (locatario: Locatario) => {
    //Gravar dados das propriedades
    api.delete(`proprietarios/${propriedade.id}`).
      then(result => {
        toast({
          title: 'Propriedade excluída com sucesso',
          description: `Propriedade excluída com sucesso`
        });
      });
  }

  function handlerUpdatePropriedade(data: PropImovelSchema) {
    const formData = new FormData();

    console.log(propEdit);
    console.log(data);

    if (propEdit) {
      formData.append('id', propEdit.id.toString());
      formData.append('pessoaId', propEdit.pessoaId.toString());
      formData.append('cota_imovel', (data.cota_imovel ? data.cota_imovel.toString() : ""));
      formData.append('imovelId', (data.imovelId ? data.imovelId.toString() : ""));

      console.log(formData);

      api.put(`proprietarios/${propEdit.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).
        then(result => {
          toast({
            title: 'Propriedade altarada com sucesso',
            description: `Propriedade altarada com sucesso`
          });
          let tst = result.statusText;
          tst = "";
        });
    }

  }*/

  //Locação 
  /*const handlerNewLoc = () => {
    setCotaImovel(0);
    setPropImovelId(0);
    setSelImovel('');
    locacaoMethods.reset();
    locacaoMethods.setValue('status', LocacaoStatus.AGUARDANDO_DOCUMENTOS);
    //locacaoMethods.setValue('pessoaId', (id! ? id : 0));
    console.log((id! ? id : 0));
  }*/

  /*const handlerEditLocacao = (locacao: Locacao) => {
    if (locacao) {
      setCotaImovelAlt(0);
      setPropImovelIdAlt(0);
      setSelImovelAlt('');
      imovelLocAlt.reset();
      setLocEdit(locacao);
      //setCotaImovelAlt(proprietario.cota_imovel);
      //setSelImovelAlt(proprietario.imovelId.toString());
      //setPropImovelIdAlt(proprietario.imovelId);
      imovelLocAlt.setValue('dataInicio', moment(locacao.dataInicio).format("YYYY-MM-DD"));
      imovelLocAlt.setValue('dataFim', new Date(moment(locacao.dataFim).format("YYYY-MM-DD")));
      imovelLocAlt.setValue('valor_aluguel', locacao.valor_aluguel);
      imovelLocAlt.setValue('status', locacao.status);
      imovelLocAlt.setValue('garantiaLocacaoTipo', locacao.garantiaLocacaoTipo);
      imovelLocAlt.setValue('imovelId', locacao.imovelId);
      imovelLocAlt.setValue('fiadores', (locacao.fiadores ? locacao.fiadores.map(x => { return { id: x.id, nome: (x.pessoa ? x.pessoa?.nome : '') } }) : []));
    }
  }*/

  /*const handleDeleteLocacao = (propriedade: Proprietario) => {
    //Gravar dados das propriedades
    api.delete(`locacoes/${propriedade.id}`).
      then(result => {
        toast({
          title: 'Locação excluída com sucesso',
          description: `Locação excluída com sucesso`
        });
        let tst = result.statusText;
        tst = "";
      });
  }*/

  /*function handlerUpdateLocacao(data: LocacaoSchema) {
    const formData = new FormData();

    console.log(locEdit);
    console.log(data);

    if (locEdit) {
      formData.append('id', locEdit.id.toString());
      formData.append('pessoaId', locEdit.pessoaId.toString());
      formData.append('cota_imovel', data.cota_imovel.toString());
      formData.append('imovelId', data.imovelId.toString());

      console.log(formData);

      api.put(`locacoes/${locEdit.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).
        then(result => {
          toast({
            title: 'Locação altarada com sucesso',
            description: `Locação altarada com sucesso`
          });

        });
    }

  }*/

  /*function handleSubmitLocacao(data: LocacaoSchema) {
    const formData = new FormData();

    console.log(JSON.stringify(data.fiadores));
    console.log(data?.fiadores?.map(x => { return x.id; }).toString());


    formData.append('dataInicio', moment(data.dataInicio).format("YYYY-MM-DD"));
    formData.append('dataFim', moment(data.dataFim).format("YYYY-MM-DD"));
    formData.append('valor_aluguel', (data.valor_aluguel ? data.valor_aluguel.toString() : ""));
    formData.append('status', data.status);
    formData.append('imovelId', (data.imovelId ? data.imovelId.toString() : '0'));
    formData.append('dia_vencimento', (data.dia_vencimento ? data.dia_vencimento.toString() : ""));
    formData.append('garantiaLocacaoTipo', data.garantiaLocacaoTipo);
    formData.append('fiador', (data.fiadores ? data.fiadores.map(x => { return x.id; }).toString() : ''));
    formData.append('numeroTitulo', (data.tituloCap?.numeroTitulo ? data.tituloCap?.numeroTitulo.toString() : '0'));
    formData.append('numeroSeguro', (data.seguroFianca?.numeroSeguro ? data.seguroFianca?.numeroSeguro.toString() : '0'));
    formData.append('valorDeposito', (data.depCalcao?.valorDeposito ? data.depCalcao?.valorDeposito.toString() : '0'));
    formData.append('quantidadeMeses', (data.depCalcao?.quantidadeMeses ? data.depCalcao?.quantidadeMeses.toString() : '0'));
    //formData.append('pessoaId', (data.pessoaId! ? data.pessoaId.toString() : '0'));

    console.log(formData.values());

    api.post(`locacoes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).
      then(result => {
        toast({
          title: 'Locação criada com sucesso',
          description: `Locação criada com sucesso`
        });
        let tst = result.statusText;
        tst = "";
      });
  }
      */
  const handlerDetailLocatario = (id: number) => {
    navigate(`${ROUTE.CLIENTES}/${id}`)
  }

  /*const handleSelectFiador = (fiador: Pessoa | undefined) => {
    console.log(selGarantia);
    setSelFiador(false);
    if (fiador) {
      locacaoFiadores.append({
        nome: fiador.nome,
        id: fiador.id
      });
    }
    console.log(locacaoFiadores);
  }*/

  /*const handlerChangeGarantia = (e: GarantiaLocacao) => {
    let bol_limpa = {
      fiador: true,
      calcao: true,
      seguro: true,
      titulo: true,
    };

    setSelGarantia(e);
    console.log(e);

    locacaoMethods.setValue('garantiaLocacaoTipo', e);

    switch (e) {
      case GarantiaLocacao.DEPOSITO_CALCAO:
        bol_limpa.calcao = false;
        bol_limpa.fiador = true;
        bol_limpa.seguro = true;
        bol_limpa.titulo = true;
        break;

      case GarantiaLocacao.FIADOR:
        bol_limpa.calcao = true;
        bol_limpa.fiador = false;
        bol_limpa.seguro = true;
        bol_limpa.titulo = true;
        break;

      case GarantiaLocacao.SEGURO_FIANCA:
        bol_limpa.calcao = true;
        bol_limpa.fiador = true;
        bol_limpa.seguro = false;
        bol_limpa.titulo = true;
        break;

      case GarantiaLocacao.TITULO_CAPITALIZACAO:
        bol_limpa.calcao = true;
        bol_limpa.fiador = true;
        bol_limpa.seguro = true;
        bol_limpa.titulo = false;
        break;
    }

    //limpa fiador
    if (bol_limpa.fiador) {
      if (locacaoFiadores.fields.length > 0) {
        for (let i = 0; i < locacaoFiadores.fields.length; i++) {
          locacaoFiadores.remove(i);
        }
      }
      setSelFiador(false);
    }
    else {
      setSelFiador(true);
    }

    if (bol_limpa.calcao) {
      locacaoMethods.setValue('depCalcao.valorDeposito', 0);
      locacaoMethods.setValue('depCalcao.quantidadeMeses', 0);
    }

    if (bol_limpa.seguro) {
      locacaoMethods.setValue('seguroFianca.numeroSeguro', '0');
    }

    if (bol_limpa.titulo) {
      locacaoMethods.setValue('tituloCap.numeroTitulo', '0');
    }

  }*/

  /*const supabaseUrl = "https://jrseqfittadsxfbmlwvz.supabase.co";
  //SUPABASE_URL="https://jrseqfittadsxfbmlwvz.supabase.co"
  //SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc2VxZml0dGFkc3hmYm1sd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODIxNzAsImV4cCI6MjA0NDM1ODE3MH0.37dIwEoJYD-btVZCyEjq1ESY8TN2J3uJlD5nTqw2Hmg"
  const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc2VxZml0dGFkc3hmYm1sd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODIxNzAsImV4cCI6MjA0NDM1ODE3MH0.37dIwEoJYD-btVZCyEjq1ESY8TN2J3uJlD5nTqw2Hmg";

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('your-bucket-name') // Replace with your bucket name
        .download(filePath);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName; // Desired filename for download
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      //console.error('Error downloading file:', error.message);
      console.error('Error downloading file:', error);
    }
  };*/

  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{locacao?.imovel?.endereco.logradouro}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className=''>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Locação
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o locacao e todos
                os dados associados a ele.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProprietario}>
                Sim, excluir locacao
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Tabs defaultValue="personal-info">
        <TabsList>
          <TabsTrigger value="personal-info" className='text-[0.8rem]'>Dados Locação</TabsTrigger>
          <TabsTrigger value="locatarios" className='text-[0.8rem]'>Locatários</TabsTrigger>
          <TabsTrigger value="fiadores" className='text-[0.8rem]'>Fiadores</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info" className="space-y-4">
          <DetalhesLocacaoForm />
        </TabsContent>

        {/*locatários */}
        <TabsContent value="locatarios" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Locatários</h2>
          </div>

          {locacao?.locatarios?.map((locatario) => (
            <Card key={locatario.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{locatario.pessoa?.nome}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="font-semibold">Dados do Locatário</Label>
                <div className='grid grid-cols-10 flex justify-items-start'>
                  <div className=''>
                    <Mail className='text-gray-500' />
                  </div>
                  <div className='text-gray-500'>
                    {locatario.pessoa?.email?.toString()}
                  </div>
                </div>
                <div className='grid grid-cols-10 flex justify-items-start'>
                  <Phone className='text-gray-500' />
                  <div className='text-gray-500'>
                    {locatario.pessoa?.telefone?.toString()}
                  </div>

                </div>
                <div className="grid grid-cols-4 gap-4 flex items-end">
                  <Button
                    className='col-start-4'
                    variant="secondary"
                    size="sm"
                    onClick={() => { handlerDetailLocatario(locatario.pessoa?.id ? locatario.pessoa?.id : 0) }}
                    style={
                      {
                        fontSize: '0.7rem',
                      }}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Fiadores */}
        <TabsContent value="fiadores" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[1.3rem]">Fiadores</h2>
          </div>

          {locacao?.fiadores?.map((fiador) => (
            <Card key={fiador.pessoaId}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{fiador.pessoa?.nome}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="font-semibold">Dados do Locatário</Label>
                <div className='grid grid-cols-10 flex justify-items-start'>
                  <div className=''>
                    <Mail className='text-gray-500' />
                  </div>
                  <div className='text-gray-500'>
                    {fiador.pessoa?.email?.toString()}
                  </div>
                </div>
                <div className='grid grid-cols-10 flex justify-items-start'>
                  <Phone className='text-gray-500' />
                  <div className='text-gray-500'>
                    {fiador.pessoa?.telefone?.toString()}
                  </div>

                </div>
                <div className="grid grid-cols-4 gap-4 flex items-end">
                  <Button
                    className='col-start-4'
                    variant="secondary"
                    size="sm"
                    onClick={() => { handlerDetailLocatario(fiador.pessoaId ? fiador.pessoaId : 0) }}
                    style={
                      {
                        fontSize: '0.7rem',
                      }}
                  >
                    Ver detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
