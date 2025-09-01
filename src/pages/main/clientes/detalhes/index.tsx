//import { createClient } from '@supabase/supabase-js';
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { ROUTE } from '@/enums/routes.enum'
import { toast } from '@/hooks/use-toast'
import api from '@/services/axios/api'
import { queryClient } from '@/services/react-query/query-client'
import { transformNullToUndefined } from '@/utils/transform-null-to-undefined'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import {  Calendar, Edit, Link2Off, Plus, Search, Trash2, X } from 'lucide-react'
import * as React from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { PessoaStatus } from '@/enums/pessoal/status-pesoa'
import { Pessoa } from '@/interfaces/pessoa'
import { ClienteSchema } from '@/schemas/cliente.schema'
import { PropImovelSchema, propImoveSchema, proprietarioSchema } from '@/schemas/proprietario.schema'
import { ClienteFormContent, ClienteFormRoot } from '../components/cliente-form'
import { ImovelStatus } from '@/enums/imovel/enums-imovel'
import { Imovel } from '@/interfaces/imovel'
import { DialogClose } from '@radix-ui/react-dialog'
import { Proprietario } from '@/interfaces/proprietario'
import { GARANTIA_LOCACAO_OPTIONS } from '@/constants/garantia-locacao'
import ListarClientes from '..'
import { GarantiaLocacao, LocacaoStatus } from '@/enums/locacao/enums-locacao'
import { locacaoSchema, LocacaoSchema } from '@/schemas/locacao.schema'
import { Locacao } from '@/interfaces/locacao'
import { STATUS_LOCACAO_OPTIONS } from '@/constants/status-locacao'
import { useGlobalParams } from '@/globals/GlobalParams';
//import { boolean } from 'zod';
import ListarImoveis from '../../imoveis/listarImoveis';
import { useMediaQuery } from 'react-responsive';

// Mock data for demonstration
/*const cliente = {
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

const fetchDocumentFiles = async (documents: Pessoa['documentos']) => {
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

export const DetalhesClienteForm = ({
  //id,
  desvincularClienteImovel
}: {
  //id: number
  disabled?: boolean
  desvincularClienteImovel?: () => void
}) => {


  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = React.useState(false)
  const disabled = isEditingPersonalInfo

  //const navigate = useNavigate();
  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;
  //const params = useParams();
  
  //Globals
  const glb_params = useGlobalParams();

  console.log(id);
  const { data: cliente } = useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const { data } = await api.get<Pessoa>(`/pessoas/${id}`)
      console.log(data);
      return data
    },
    enabled: !!id
  })

  const { data: documentFilesData = [], isSuccess: isSuccessDocuments } = useQuery({
    queryKey: ['documentFiles', id, cliente?.documentos],
    queryFn: () => fetchDocumentFiles(cliente?.documentos),
    enabled: !!cliente?.documentos?.length
  })

  const documentFiles = React.useMemo(() => documentFilesData, [isSuccessDocuments])

  const updateCliente = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<Pessoa>(`/pessoas/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['cliente', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })

  /*const deleteClienteMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/pessoas/${id}`)
    },
    onSuccess: () => {
      ;['cliente', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      toast({
        title: 'Cliente excluído com sucesso',
        description: `Cliente excluído com sucesso`
      })

      navigate(ROUTE.CLIENTES)
    }
  })*/

  const onSubmitClienteData = async (data: ClienteSchema) => {
    try {
      const form = new FormData()

      if (data?.nome) {
        form.append('nome', data.nome)
      }

      if (data?.documento) {
        form.append('documento', data.documento)
      }

      if (data?.email) {
        form.append('email', data.email)
      }

      if (data?.telefone) {
        form.append('telefone', data.telefone)
      }

      if (data?.profissao) {
        form.append('profissao', data.profissao)
      }

      if (data?.estadoCivil) {
        form.append('estadoCivil', data.estadoCivil)
      }

      if (data?.logradouro) {
        form.append('logradouro', data.logradouro)
      }

      if (data?.numero) {
        form.append('numero', data.numero.toString())
      }

      if (data?.complemento) {
        form.append('complemento', data.complemento)
      }

      if (data?.bairro) {
        form.append('bairro', data.bairro)
      }

      if (data?.cidade) {
        form.append('cidade', data.cidade)
      }

      if (data?.cep) {
        form.append('cep', data.cep)
      }

      if (data?.estado) {
        form.append('estado', data.estado)
      }

      if (data?.status) {
        form.append('status', data.status)
      }
      else {
        form.append('status', PessoaStatus.ATIVA)
      }

      const newDocuments = data?.documentos?.filter((doc) => !doc.id)
      newDocuments?.forEach((doc) => {
        form.append('documentos', doc.file)
      })

      if (data?.documentosToDeleteIds?.length) {
        data.documentosToDeleteIds.forEach((docId) => {
          form.append('documentosToDeleteIds[]', docId.toString())
        })
      }

      await updateCliente.mutateAsync(form)

      toast({
        title: 'Cliente atualizado com sucesso',
        description: `Cliente atualizado com sucesso`

      })
    } catch (error) {
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Ocorreu um erro ao tentar atualizar o cliente. Tente novamente.'
      })
    }
  }

  //default values
  const enderecoData = transformNullToUndefined(cliente?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(cliente || {}),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
      documentos: documentFiles?.filter((doc) => doc !== null)
    }),
    [cliente, documentFiles]
  )

  React.useEffect(() => {
    glb_params.updTitle_form('Clientes');
    if (cliente) clienteMethods.reset(defaultValues)
  }, [defaultValues])

  //react hook form

  const clienteMethods = useForm<ClienteSchema>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues,
    mode: 'onBlur'
  })

  React.useEffect(() => {
    if (cliente) {
      clienteMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
  }, [id, cliente, documentFiles])

  /*const handleDeleteProprietario = () => {
    deleteClienteMutation.mutate()
  }*/

  const hasLocatario = !!cliente?.proprietarios?.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <h2 className="mb-4 mt-8 text-xl font-bold">Dados Pessoais</h2>
          <span>
            {desvincularClienteImovel && hasLocatario && (
              <Button variant="destructive" type="button" onClick={desvincularClienteImovel}>
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
        <ClienteFormRoot
          createClienteMethods={clienteMethods}
          onSubmitClienteData={onSubmitClienteData}
        >
          <ClienteFormContent createClienteMethods={clienteMethods} disabled={!disabled} />
          <div className="mt-4">
            {disabled && (
              <Button
                className="w-full"
                disabled={
                  !clienteMethods.formState.isDirty || !clienteMethods.formState.isValid
                }
              >
                Salvar Alterações
              </Button>
            )}
          </div>
        </ClienteFormRoot>
      </CardContent>
    </Card>
  )
}

export default function DetalhesCliente() {
  //const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isPortrait = useMediaQuery({ query: '(min-width: 1224px)' })
  const isTablet = useMediaQuery({ query: '(min-width: 746px)' })
  //const isMobile = useMediaQuery({ query: '(min-width: 400px)' })

  const navigate = useNavigate()
  //const [formInitialized, setFormInitialized] = React.useState(false) // Controle de inicialização
  const dataParams = useParams<{ id: string }>();
  const id = dataParams.id ? parseInt(dataParams.id) : undefined;
  //const [proImovelId, setPropImovelId] = React.useState<number>(0);
  //const [cotaImovel, setCotaImovel] = React.useState<number>(0);
  const [selImovel, setSelImovel] = React.useState<boolean>(false);
  const [proImovelIdAlt, setPropImovelIdAlt] = React.useState<number>(0);
  //const [cotaImovelAlt, setCotaImovelAlt] = React.useState<number>(0);
  //const [selImovelAlt, setSelImovelAlt] = React.useState('');
  const [propEdit, setPropEdit] = React.useState<Proprietario>();
  //const [locEdit, setLocEdit] = React.useState<Locacao>();
  const [selGarantia, setSelGarantia] = React.useState<GarantiaLocacao>();
  const [selFiador, setSelFiador] = React.useState<boolean>(false);
  const [openImovel, setOpenImovel] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState('personal-info')


  //Globals
  const glb_params = useGlobalParams();
  //const { pessoa, addPessoa, removePessoa, updatePessoa, resetStatePessoa } = usePessoa();

  const { data: cliente } = useQuery({
    queryKey: ['cliente', id],
    queryFn: async () => {
      const { data } = await api.get<Pessoa>(`/pessoas/${id}`)
      return data
    },
    enabled: !!id
  })

  console.log(id);
  console.log(cliente);

  let imovelStatus = ImovelStatus.DISPONIVEL;

  const { data: imoveisLocacao } = useQuery({
    queryKey: ['locacoes', imovelStatus],
    queryFn: async () => {
      const { data } = await api.get<Imovel[]>(`/imoveis/locacao/?imovelStatus=${imovelStatus}`)
      return data
    },
  })

  /*const { data } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const response = await api.get<Pessoa[]>(`/pessoas`)
      return response.data;
    },
  });

  const fiadores = data?.data || [];*/

  const { data: documentFilesData = [], isSuccess: isSuccessDocuments } = useQuery({
    queryKey: ['documentFiles', id, cliente?.documentos],
    queryFn: () => fetchDocumentFiles(cliente?.documentos),
    enabled: !!cliente?.documentos?.length
  })

  const documentFiles = React.useMemo(() => documentFilesData, [isSuccessDocuments])

  /*const updateCliente = useMutation({
    mutationFn: async (data: FormData) => {
      return await api.put<Pessoa>(`/pessoas/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      ;['cliente', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })
    }
  })*/

  const deleteClienteMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/pessoas/${id}`)
    },
    onSuccess: () => {
      ;['cliente', 'documentFiles', id].forEach((key) => {
        queryClient.invalidateQueries({ queryKey: [key] })
      })

      toast({
        title: 'Cliente excluído com sucesso',
        description: `Cliente excluído com sucesso`
      })

      navigate(ROUTE.CLIENTES);
    }
  })

  //default values
  const enderecoData = transformNullToUndefined(cliente?.endereco || {})
  const defaultValues = React.useMemo(
    () => ({
      ...transformNullToUndefined(cliente || {}),
      logradouro: enderecoData?.logradouro,
      numero: enderecoData?.numero ? parseInt(enderecoData.numero) : undefined,
      complemento: enderecoData?.complemento,
      bairro: enderecoData?.bairro,
      cidade: enderecoData?.cidade,
      cep: enderecoData?.cep,
      estado: enderecoData?.estado,
      documentos: documentFiles?.filter((doc) => doc !== null)
    }),
    [cliente, documentFiles]
  )

  //react hook form
  const clienteMethods = useForm<ClienteSchema>({
    resolver: zodResolver(proprietarioSchema),
    defaultValues,
    mode: 'onBlur'
  })

  const clienteProp = useForm<PropImovelSchema>({
    resolver: zodResolver(propImoveSchema),
  });

  const clientePropAlt = useForm<PropImovelSchema>({
    resolver: zodResolver(propImoveSchema),
  });

  const locacaoMethods = useForm<LocacaoSchema>({
    resolver: zodResolver(locacaoSchema),
  });

  const {
    control,
    //handleSubmit,
    //formState: { errors },
  } = locacaoMethods;

  const locacaoFiadores = useFieldArray({
    control,
    name: 'fiadores'
  });

  const imovelLocAlt = useForm<LocacaoSchema>({
    resolver: zodResolver(locacaoSchema),
    mode: "onBlur"
  });

  //Imóveis lista 
  const clientePropers = useFieldArray({
    control: clienteProp.control,
    name: 'proprietarios'
  });

  React.useEffect(() => {
    if (cliente) {
      clienteMethods.reset(defaultValues) // seta os valores do formulário com os dados do proprietário
    }
    clienteProp.reset();
    clientePropAlt.reset();
  }, [id, cliente, documentFiles])

  const handleDeleteProprietario = () => {
    deleteClienteMutation.mutate()
  }

  function handleSubmitPropriedade(data: PropImovelSchema) {
    console.log(data);

    const formData = new FormData();

    formData.append('pessoaId', (id!! ? id.toString() : '0'));
    formData.append('cota_imovel', (data.cota_imovel ? data.cota_imovel.toString(): ""));
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

        let tst = "";
        tst = result.statusText + " " + tst;
      });


  }

  const handlerNewProp = () => {
    //setCotaImovel(0);
    if (clientePropers.fields.length > 0) {
      clientePropers.remove(0);
    }
    clienteProp.reset();
    clienteProp.setValue('pessoaId', id!)
    setOpenImovel(true);
  }

  const handlerEditPropriedade = (proprietario: Proprietario) => {
    if (proprietario) {
      //setCotaImovelAlt(0);
      setPropImovelIdAlt(0);
      //setSelImovelAlt('');
      clientePropAlt.reset();
      setPropEdit(proprietario);
      //setCotaImovelAlt(proprietario.cota_imovel);
      //setSelImovelAlt(proprietario.imovelId.toString());
      setPropImovelIdAlt(proprietario.imovelId);
      clientePropAlt.setValue('imovelId', proprietario.imovelId);
      clientePropAlt.setValue('cota_imovel', proprietario.cota_imovel);
    }
  }

  const handleDeletePropriedade = (propriedade: Proprietario) => {
    //Gravar dados das propriedades
    api.delete(`proprietarios/${propriedade.id}`).
      then(result => {
        toast({
          title: 'Propriedade excluída com sucesso',
          description: `Propriedade excluída com sucesso`
        });
        let tst = "";
        tst = result.statusText + " " + tst;
      });
  }

  function handlerUpdatePropriedade(data: PropImovelSchema) {
    const formData = new FormData();

    console.log(propEdit);
    console.log(data);

    if (propEdit) {
      formData.append('id', propEdit.id.toString());
      formData.append('pessoaId', propEdit.pessoaId.toString());
      formData.append('cota_imovel', (data.cota_imovel ? data.cota_imovel.toString(): ""));
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
          let tst = "";
          tst = result.statusText + tst;
        });
    }

  }

  //Locação 
  /*const handlerNewLoc = () => {
    setCotaImovel(0);
    setPropImovelId(0);
    locacaoMethods.reset();
    locacaoMethods.setValue('status', LocacaoStatus.AGUARDANDO_DOCUMENTOS);
    locacaoMethods.setValue('imovelId', (id! ? id : 0));
    console.log((id! ? id : 0));
  }*/

  const handlerEditLocacao = (locacao: Locacao) => {
    if (locacao) {
      //setCotaImovelAlt(0);
      setPropImovelIdAlt(0);
      //setSelImovelAlt('');
      imovelLocAlt.reset();
      //setLocEdit(locacao);
      //setCotaImovelAlt(proprietario.cota_imovel);
      //setSelImovelAlt(proprietario.imovelId.toString());
      //setPropImovelIdAlt(proprietario.imovelId);
      //imovelLocAlt.setValue('dataInicio', new Date(moment((locacao.dataInicio ? locacao.dataInicio : '')).format("YYYY-MM-DD")));
      imovelLocAlt.setValue('dataInicio', moment((locacao.dataInicio ? locacao.dataInicio : '')).format("YYYY-MM-DD"));
      imovelLocAlt.setValue('dataFim', new Date(moment((locacao.dataFim ? locacao.dataFim : '')).format("YYYY-MM-DD")));
      imovelLocAlt.setValue('valor_aluguel', locacao.valor_aluguel);
      imovelLocAlt.setValue('status', locacao.status);
      imovelLocAlt.setValue('garantiaLocacaoTipo', locacao.garantiaLocacaoTipo);
      imovelLocAlt.setValue('imovelId', locacao.imovelId);
      imovelLocAlt.setValue('fiadores', (locacao.fiadores ? locacao.fiadores.map(x => { return { id: x.id, nome: (x.pessoa ? x.pessoa?.nome : '') } }) : []));
    }
  }

  /*const handleDeleteLocacao = (propriedade: Proprietario) => {
    //Gravar dados das propriedades
    api.delete(`locacoes/${propriedade.id}`).
      then(result => {
        toast({
          title: 'Locação excluída com sucesso',
          description: `Locação excluída com sucesso`
        });
      });
  }

  function handlerUpdateLocacao(data: LocacaoSchema) {
    const formData = new FormData();

    console.log(locEdit);
    console.log(data);

    if (locEdit) {
      formData.append('id', locEdit.id.toString());
      formData.append('pessoaId', locEdit.pessoaId.toString());
      formData.append('cota_imovel', data.cota_imovel.toString());
      formData.append('imovelId', data.imovelId.toString());

      console.log(formData);
    }

  }

  function handleSubmitLocacao(data: LocacaoSchema) {
    const formData = new FormData();

    console.log(JSON.stringify(data.fiadores));
    console.log(data?.fiadores?.map(x => { return x.id; }).toString());


    formData.append('dataInicio', data.dataInicio);
    formData.append('dataFim', moment((data.dataFim ? data.dataFim : '')).format("YYYY-MM-DD"));
    formData.append('valor_aluguel', ( data.valor_aluguel ? data.valor_aluguel.toString() : "0"));
    formData.append('status', data.status);
    formData.append('imovelId', (data.imovelId ? data.imovelId.toString() : '0'));
    formData.append('dia_vencimento', moment((data.dia_vencimento ? data.dia_vencimento : '')).format("YYYY-MM-DD"));
    formData.append('garantiaLocacaoTipo', data.garantiaLocacaoTipo);
    formData.append('fiador', (data.fiadores ? data.fiadores.map(x => { return x.id; }).toString() : ''));
    formData.append('numeroTitulo', (data.tituloCap?.numeroTitulo ? data.tituloCap?.numeroTitulo.toString() : '0'));
    formData.append('numeroSeguro', (data.seguroFianca?.numeroSeguro ? data.seguroFianca?.numeroSeguro.toString() : '0'));
    formData.append('valorDeposito', (data.depCalcao?.valorDeposito ? data.depCalcao?.valorDeposito.toString() : '0'));
    formData.append('quantidadeMeses', (data.depCalcao?.quantidadeMeses ? data.depCalcao?.quantidadeMeses.toString() : '0'));
    formData.append('locatario', (data.locatarios ? data.locatarios.map(x => { return x.id; }).toString() : ''));

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
        let tst =result.statusText;
        tst = "";
      });
  }*/
 
  const handlerDetailImovel = (id: number) => {
    navigate(`${ROUTE.IMOVEIS}/${id}`)
  }

  const handleSelectFiador = (fiador: Pessoa | undefined) => {
    console.log(selGarantia);
    setSelFiador(false);
    if (fiador) {
      locacaoFiadores.append({
        nome: fiador.nome,
        id: fiador.id
      });
    }
    console.log(locacaoFiadores);
  }

  const handlerChangeGarantia = (e: GarantiaLocacao) => {
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

  }

  //const supabaseUrl = "https://jrseqfittadsxfbmlwvz.supabase.co";
  //SUPABASE_URL="https://jrseqfittadsxfbmlwvz.supabase.co"
  //SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc2VxZml0dGFkc3hmYm1sd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODIxNzAsImV4cCI6MjA0NDM1ODE3MH0.37dIwEoJYD-btVZCyEjq1ESY8TN2J3uJlD5nTqw2Hmg"
  //const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc2VxZml0dGFkc3hmYm1sd3Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3ODIxNzAsImV4cCI6MjA0NDM1ODE3MH0.37dIwEoJYD-btVZCyEjq1ESY8TN2J3uJlD5nTqw2Hmg";

  //const supabase = createClient(supabaseUrl, supabaseAnonKey);

  /*const handleDownload = async (filePath: string, fileName: string) => {
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

  const handlerSelImovel = (origin: string) => {

    glb_params.updOrigin_url("imoveis");
    console.log('seleciona ' + origin);
    switch (origin) {
      case 'proprietarios':
        if (clientePropers.fields.length > 0) {
          clientePropers.remove(0);
        }
        break;

      case 'locacoes':
        break;
    }
    setSelImovel(true);

  }

  //Retorno ao selecionar o propriétario/locatário/fiador
  const handleSelectImovel = (imovel: Imovel | undefined) => {

    if (imovel) {
      console.log(glb_params.pastaOrig);

      switch (glb_params.pastaOrig) {
        case 'propriedades':
          if (clientePropers.fields.length === 0) {
            clientePropers.append({
              nome: imovel.endereco.logradouro,
              id: imovel.id
            });
            clientePropers.fields.map((item, index) => {
              console.log(item.nome);
              console.log(index);
            })
            clienteProp.setValue('imovelId', imovel.id);
            clienteProp.setValue('pessoaId', id!);
          }
          if (glb_params.origin_url === 'clientes') {
            setOpenImovel(true);
          }
          break;

        case 'locacoes':
          break;
      }
      setActiveTab(glb_params.pastaOrig);
    }


    setSelImovel(false);
  }

  const handlerChangeFolder = (folder: string) => {
    glb_params.updOrigin_url("imoveis");
    glb_params.updId_orig((id! ? id : 0).toString());
    glb_params.updPastaOrig(folder);
    setActiveTab(folder);
  }

  return (
    <div className="container mx-auto space-y-6 p-4 font-[Poppins-regular]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{cliente?.nome}</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Cliente
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente o cliente e todos
                os dados associados a ele.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteProprietario}>
                Sim, excluir cliente
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Tabs value={activeTab} onValueChange={(value) => { handlerChangeFolder(value) }}>
        <TabsList>
          <TabsTrigger value="personal-info" className='text-[0.8rem]'>Dados Pessoais</TabsTrigger>
          <TabsTrigger value="propriedades" className='text-[0.8rem]'>Propriedades</TabsTrigger>
          <TabsTrigger value="locacoes" className='text-[0.8rem]'>Locações</TabsTrigger>
          <TabsTrigger value="finance" className='text-[0.8rem]'>Fianças</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-info" className="space-y-4">
          <DetalhesClienteForm />
        </TabsContent>

        {/*Propriedades */}
        <TabsContent value="propriedades" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Propriedades</h2>
            <Button
              onClick={handlerNewProp}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Propriedade
            </Button>
            <Dialog open={openImovel} onOpenChange={setOpenImovel}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Propriedade</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da nova propriedada para este cliente.
                  </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={clienteProp.handleSubmit(handleSubmitPropriedade)}>
                  <div className="grid grid-cols-1 gap-4 flex items-center">
                    <Button onClick={() => { handlerSelImovel('propriedades') }}>
                      <Search className="mr-2 h-4 w-4" />
                      Imóveis
                    </Button>

                    {(clientePropers.fields.length > 0) && (
                      <div className="grid grid-cols-1 gap-4 flex items-center">
                        {clientePropers.fields.map((field, index) => (
                          <div className='flex justify-between items-center gap-2 mt-2 border-solid border-2 border-gray-250 rounded p-1' key={field.id}>
                            <Label >{field.nome}</Label>
                            <button
                              className='border bg-zinc-200 hover:bg-zinc-400'
                              type="button"
                              onClick={() => {
                                clienteProp.setValue('imovelId', 0);
                                clientePropers.remove(index);
                              }}
                            >
                              <X className='px-1'></X>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!!clienteProp?.formState?.errors?.imovelId?.message && (
                      <span>{clienteProp?.formState?.errors?.imovelId?.message}</span>
                    )}

                  </div>
                  {selImovel && (
                    <Card id='teste' className='h-full'>
                      <div className="flex  justify-end">
                        <Button onClick={() => { setSelImovel(false) }}
                          className='w-8 h-8 rounded-full bg-transparent text-black bg-zinc-200 hover:bg-zinc-400'>X</Button>
                      </div>
                      <CardHeader>
                        <DialogTitle className='flex items-center justify-center'>Selecionar o Proprietário</DialogTitle>
                      </CardHeader>
                      <CardContent className='mt-2 h-120'>
                        <ListarImoveis limitView={1} exclude={cliente && cliente?.proprietarios ? cliente?.proprietarios?.map((proper) => { return proper.id }).toString() : ''} onSelectImovel={handleSelectImovel} />
                      </CardContent>
                    </Card>
                  )}

                  <div>
                    <Label htmlFor="cotaImovel">Cota do Imóvel</Label>
                    <Input id="cotaImovel" type="number" placeholder="0.00"
                      {...clienteProp.register('cota_imovel')}
                      helperText={clienteProp.formState?.errors?.cota_imovel?.message}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit"
                      >Adicionar Propriedade</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className={(isTablet ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1')}>
            {cliente?.proprietarios?.map((proprietario) => (
              <Card key={proprietario.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{proprietario.id}</span>
                    <Badge variant="default">{proprietario.imovel?.tipo}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Label className="font-semibold">Cota do imóvel</Label>
                    <p>
                      % {proprietario.cota_imovel.toLocaleString('pt-BR')}
                    </p>
                  </div>

                  <Label className="font-semibold">Dados do imóvel</Label>
                  <p>
                    {proprietario.imovel?.tipo.toString() + ', ' +
                      proprietario.imovel?.endereco.logradouro.toString() + ' ' +
                      proprietario.imovel?.endereco.numero.toString() + ' ' +
                      proprietario.imovel?.endereco.complemento?.toString() + ' ' +
                      proprietario.imovel?.endereco.bairro.toString() + ' ' +
                      proprietario.imovel?.endereco.cidade.toString()}

                  </p>
                  <div className="grid grid-cols-4 gap-4 flex items-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { handlerDetailImovel(proprietario.imovelId) }}
                      style={
                        {
                          fontSize: '0.7rem',
                        }}
                    >
                      Ver detalhes
                    </Button>
                  </div>
                  <hr className="border-t border-gray-300 mt-5" />
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm"
                        onClick={() => { handlerEditPropriedade(proprietario) }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Alterar Propriedade</DialogTitle>
                        <DialogDescription>
                          Preencha os detalhes da nova propriedade para este cliente.
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4" onSubmit={clientePropAlt.handleSubmit(handlerUpdatePropriedade)}>
                        <div>
                          <Label htmlFor="imovel">Imóvel</Label>
                          <Select
                            value={proImovelIdAlt.toString()}
                            onValueChange={(e) => {
                              //setPropImovelId(parseInt(e));
                              clientePropAlt.setValue('imovelId', parseInt(e))
                            }}
                            {...clientePropAlt.register('imovelId')}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o imóvel" />
                            </SelectTrigger>
                            <SelectContent>
                              {imoveisLocacao?.map((locacao) => (
                                <SelectItem value={locacao.id.toString()}
                                >
                                  {locacao.tipo.toString() + ', ' +
                                    locacao.endereco.logradouro.toString() + ' ' +
                                    locacao.endereco.numero.toString() + ' ' +
                                    locacao.endereco.complemento?.toString() + ' ' +
                                    locacao.endereco.bairro.toString() + ' ' +
                                    locacao.endereco.cidade.toString()}

                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {clientePropAlt.formState?.errors?.imovelId?.message}
                        </div>
                        <div>
                          <Label htmlFor="cotaImovel">Cota do Imóvel</Label>
                          <Input id="cotaImovel" type="number" placeholder="0.00"
                            {...clientePropAlt.register('cota_imovel')}
                            helperText={clientePropAlt.formState?.errors?.cota_imovel?.message}
                            onChange={(e) => { clientePropAlt.setValue('cota_imovel', parseFloat(e.target.value)) }}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="submit"
                            >Salvar Alterações</Button>
                          </DialogClose>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm"
                    onClick={() => { handleDeletePropriedade(proprietario) }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Locações */}
        <TabsContent value="locacoes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[1.3rem]">Locações</h2>
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  onClick={handlerNewLoc}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Locação
                </Button>
              </DialogTrigger>
              <DialogContent className='font-[Poppins-regular]'>
                <DialogHeader>
                  <DialogTitle>Adicionar Nova Locação</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da nova locação para este cliente.
                  </DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={locacaoMethods.handleSubmit(handleSubmitLocacao)}>
                  <div style={{ display: (!selFiador ? 'block' : 'none') }}>
                    <Label className="text-base">
                      Imóvel
                      <div className="mt-2">
                        <Controller
                          name="imovelId"
                          control={locacaoMethods.control}
                          render={({ field }) => (
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value)
                                locacaoMethods.setValue('valor_aluguel', imoveisLocacao?.filter(x => x.id === parseFloat(value))[0].valor_aluguel || 0)
                                locacaoMethods.setValue('imovelId', parseFloat(value));

                              }}
                              value={field.value?.toString()}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o imóvel" />
                              </SelectTrigger>
                              <SelectContent>
                                {imoveisLocacao?.map((locacao) => (
                                  <SelectItem value={locacao.id.toString()}>{locacao.tipo.toString() + ", " + locacao.endereco.logradouro.toString() + " " + locacao.endereco.bairro + " " + locacao.endereco.cidade}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {!!locacaoMethods?.formState?.errors?.imovelId?.message && (
                          <span>{locacaoMethods?.formState?.errors?.imovelId?.message}</span>
                        )}
                      </div>
                    </Label>
                    <div className='mt-2'>
                      <Label htmlFor="valor_aluguel">Valor do Aluguel</Label>
                      <Input id="valor_aluguel" type="number" placeholder="0.00"
                        {...locacaoMethods.register('valor_aluguel')}
                        helperText={locacaoMethods.formState?.errors?.valor_aluguel?.message}
                        onChange={(e) => { locacaoMethods.setValue('valor_aluguel', parseFloat(e.target.value)) }}
                      />
                    </div>
                    <div className='mt-2'>
                      <Label htmlFor="dataInicio">Data de Início</Label>
                      <Input id="dataInicio" type="date"
                        {...locacaoMethods.register('dataInicio')}
                        helperText={locacaoMethods.formState?.errors?.dataInicio?.message}
                        onChange={(e) => { locacaoMethods.setValue('dataInicio', e.target.value) }}
                      />
                    </div>
                    <div className='mt-2'>
                      <Label htmlFor="dataFim">Data de Fim (opcional)</Label>
                      <Input id="dataFim" type="date"
                        {...locacaoMethods.register('dataFim')}
                        helperText={locacaoMethods.formState?.errors?.dataFim?.message}
                        onChange={(e) => { locacaoMethods.setValue('dataFim', e.target.value) }}
                      />
                    </div>
                    <div className='mt-2'>
                      <Label htmlFor="diaVencto">Dia de Vencimento</Label>
                      <Input id="diaVencto" type="number"
                        {...locacaoMethods.register('dia_vencimento')} placeholder='0'
                        helperText={locacaoMethods.formState?.errors?.dia_vencimento?.message}
                        onChange={(e) => { locacaoMethods.setValue('dia_vencimento', parseInt(e.target.value)) }}
                      />
                    </div>
                    <div className='mt-2'>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea id="observacoes" placeholder="Detalhes adicionais sobre a locação" />
                    </div>
                    <div className='mt-2'>
                      <Label htmlFor="Garantia">Tipo de Garantia</Label>
                      <Select
                        onValueChange={(e: GarantiaLocacao) => { handlerChangeGarantia(e) }
                        }>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a garantia" />
                        </SelectTrigger>
                        <SelectContent>
                          {GARANTIA_LOCACAO_OPTIONS.map((garantia) => (
                            <SelectItem key={garantia.label} value={garantia.value}>
                              {garantia.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {(selGarantia === GarantiaLocacao.FIADOR && selFiador) && (
                    <div>
                      <Card>
                        <CardHeader>
                          <DialogTitle className='flex items-center'>Selecionar o Fiador</DialogTitle>
                        </CardHeader>
                        <CardContent className='mt-2 h-120'>
                          <ListarClientes limitView={1} txtVinc='Vincular Locação' onSelectCliente={handleSelectFiador} exclude='' />
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {(locacaoFiadores.fields.length > 0) && (
                    <div>
                      <div className="grid grid-cols-2 gap-2 items-center justify-between">
                        <Label>Fiadores</Label>
                        <button
                          className='border bg-zinc-200 hover:bg-zinc-400 rounded'
                          type="button"
                          onClick={() => { setSelFiador(true) }}
                        >
                          Adicionar
                        </button>
                      </div>
                      {locacaoFiadores.fields.map((field, index) => (
                        <div className='flex items-center gap-2 mt-2'>
                          <Label >{field.nome}</Label>
                          <button
                            className='border bg-zinc-200 hover:bg-zinc-400'
                            type="button"
                            onClick={() => locacaoFiadores.remove(index)}
                          >
                            <X className='px-1'></X>
                          </button>
                        </div>
                      ))}
                    </div>
                    // <div>
                    //   <div className='mt-2'>
                    //     <Label>Fiador: {selFiador?.nome}</Label>
                    //   </div>
                    // </div>
                  )}

                  {selGarantia === GarantiaLocacao.TITULO_CAPITALIZACAO && (
                    <div className='mt-2'>
                      <Label htmlFor="titulocap">Número do Título</Label>
                      <Input id="titulocap" type="number"
                        {...locacaoMethods.register('tituloCap.numeroTitulo')}
                        helperText={locacaoMethods.formState?.errors?.tituloCap?.numeroTitulo?.message}
                        onChange={(e) => { locacaoMethods.setValue('tituloCap.numeroTitulo', e.target.value) }}
                      />
                    </div>
                  )}

                  {selGarantia === GarantiaLocacao.SEGURO_FIANCA && (
                    <div className='mt-2'>
                      <Label htmlFor="numseguro">Número do Seguro</Label>
                      <Input id="numseguro" type="number"
                        {...locacaoMethods.register('seguroFianca.numeroSeguro')}
                        helperText={locacaoMethods.formState?.errors?.seguroFianca?.numeroSeguro?.message}
                        onChange={(e) => { locacaoMethods.setValue('seguroFianca.numeroSeguro', e.target.value) }}
                      />
                    </div>
                  )}

                  {selGarantia === GarantiaLocacao.DEPOSITO_CALCAO && (
                    <div>
                      <div className='mt-2'>
                        <Label htmlFor="valdepCalcao">Valor do depósito</Label>
                        <Input id="valdepCalcao" type="number" placeholder='0,00'
                          {...locacaoMethods.register('depCalcao.valorDeposito')}
                          helperText={locacaoMethods.formState?.errors?.depCalcao?.valorDeposito?.message}
                          onChange={(e) => { locacaoMethods.setValue('depCalcao.valorDeposito', parseFloat(e.target.value)) }}
                        />
                      </div>
                      <div className='mt-2'>
                        <Label htmlFor="qtddepCalcao">Quantidade de meses</Label>
                        <Input id="qtddepCalcao" type="number"
                          {...locacaoMethods.register('depCalcao.quantidadeMeses')}
                          helperText={locacaoMethods.formState?.errors?.depCalcao?.quantidadeMeses?.message}
                          onChange={(e) => { locacaoMethods.setValue('depCalcao.quantidadeMeses', parseFloat(e.target.value)) }}
                        />
                      </div>
                    </div>
                  )}

                  <div className='mt-2'>
                    <Label htmlFor="status">Situação da Locação</Label>
                    <Select
                      onValueChange={(e: LocacaoStatus) => {
                        locacaoMethods.setValue('status', e)
                      }
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a situação" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_LOCACAO_OPTIONS.map((status) => (
                          <SelectItem key={status.label} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="submit"
                      >Adicionar Locação</Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog> */}
          </div>

          <div className={(isPortrait ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1')}>
            {cliente?.locatarios?.map((locatario) => (
              locatario.locacoes?.map((locacao) => {
                return (
                  <Card key={locacao.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{locacao.id}</span>
                        <Badge variant="default">{locacao.status}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 flex items-center mt-2">
                        <Label>Valor do Aluguel</Label>
                        <p className="font-semibold">
                          R$ {locacao.valor_aluguel.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-center mt-4">
                        <Label>Período</Label>
                        <p className="flex items-center text-[0.70rem]">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(locacao.dataInicio).toLocaleDateString('pt-BR')} -
                          {locacao.dataFim
                            ? new Date(locacao.dataFim).toLocaleDateString('pt-BR')
                            : 'Atual'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 items-center mt-4">
                        <Label>Imóvel</Label>
                        <p className="flex flex-col items-center text-[0.70rem]">
                          {locacao.imovel?.tipo.toString() + ", " + locacao.imovel?.endereco.logradouro.toString() + " " + locacao.imovel?.endereco.bairro + " " + locacao.imovel?.endereco.cidade}
                        </p>
                      </div>
                      <div className='flex justify-end'>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => { handlerDetailImovel(parseFloat(locacao?.imovelId.toString())) }}
                          style={
                            {
                              fontSize: '0.6rem',
                              fontWeight: 'Bold'
                            }}
                        >
                          Ver detalhes
                        </Button>
                      </div>
                      <hr className="border-t border-gray-300 mt-5" />
                    </CardContent>
                    <CardFooter className="flex justify-end space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm"
                            onClick={() => { handlerEditLocacao(locacao) }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Alterar Locação</DialogTitle>
                            <DialogDescription>
                              Preencha os detalhes da nova locação para este cliente.
                            </DialogDescription>
                          </DialogHeader>
                          <form className="space-y-4">
                            <div style={{ display: (!selFiador ? 'block' : 'none') }}>
                              <Label className="text-base">
                                Imóvel
                                <div className="mt-2">
                                  <Controller
                                    name="imovelId"
                                    control={imovelLocAlt.control}
                                    render={({ field }) => (
                                      <Select
                                        onValueChange={(value) => {
                                          field.onChange(value)
                                          imovelLocAlt.setValue('valor_aluguel', imoveisLocacao?.filter(x => x.id === parseFloat(value))[0].valor_aluguel || 0)
                                          imovelLocAlt.setValue('imovelId', parseFloat(value));

                                        }}
                                        value={field.value?.toString()}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione o imóvel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {imoveisLocacao?.map((locacao) => (
                                            <SelectItem value={locacao.id.toString()}>{locacao.tipo.toString() + ", " + locacao.endereco.logradouro.toString() + " " + locacao.endereco.bairro + " " + locacao.endereco.cidade}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  />
                                  {!!imovelLocAlt?.formState?.errors?.imovelId?.message && (
                                    <span>{imovelLocAlt?.formState?.errors?.imovelId?.message}</span>
                                  )}
                                </div>
                              </Label>
                              <div className='mt-2'>
                                <Label htmlFor="valor_aluguel">Valor do Aluguel</Label>
                                <Input id="valor_aluguel" type="number" placeholder="0.00"
                                  {...imovelLocAlt.register('valor_aluguel')}
                                  helperText={imovelLocAlt.formState?.errors?.valor_aluguel?.message}
                                  onChange={(e) => { imovelLocAlt.setValue('valor_aluguel', parseFloat(e.target.value)) }}
                                />
                              </div>
                              <div className='mt-2'>
                                <Label htmlFor="dataInicio">Data de Início</Label>
                                <Input type="date"
                                  {...imovelLocAlt.register('dataInicio')}
                                  helperText={imovelLocAlt.formState?.errors?.dataInicio?.message}
                                  //onChange={(e) => { imovelLocAlt.setValue('dataInicio', new Date(moment((e.target.value ? e.target.value : '')).format("YYYY-MM-DD"))) }}
                                  onChange={(e) => { imovelLocAlt.setValue('dataInicio', moment((e.target.value ? e.target.value : '')).format("YYYY-MM-DD")) }}
                                />
                              </div>
                              <div className='mt-2'>
                                <Label htmlFor="dataFim">Data de Fim (opcional)</Label>
                                <Input type="date"
                                  {...imovelLocAlt.register('dataFim')}
                                  helperText={imovelLocAlt.formState?.errors?.dataFim?.message}
                                  onChange={(e) => { imovelLocAlt.setValue('dataFim',                                     
                                    new Date(moment(e.target.value).format("YYYY-MM-DD"))
                                  ) }}
                                />
                              </div>
                              <div className='mt-2'>
                                <Label htmlFor="diaVencto">Dia de Vencimento</Label>
                                <Input id="diaVencto" type="number"
                                  {...imovelLocAlt.register('dia_vencimento')} placeholder='0'
                                  helperText={imovelLocAlt.formState?.errors?.dia_vencimento?.message}
                                  onChange={(e) => { imovelLocAlt.setValue('dia_vencimento', parseInt(e.target.value)) }}
                                />
                              </div>
                              <div className='mt-2'>
                                <Label htmlFor="observacoes">Observações</Label>
                                <Textarea id="observacoes" placeholder="Detalhes adicionais sobre a locação" />
                              </div>
                              <div className='mt-2'>
                                <Label htmlFor="Garantia">Tipo de Garantia</Label>
                                <Select
                                  onValueChange={(e: GarantiaLocacao) => { handlerChangeGarantia(e) }
                                  }>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a garantia" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {GARANTIA_LOCACAO_OPTIONS.map((garantia) => (
                                      <SelectItem key={garantia.label} value={garantia.value}>
                                        {garantia.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {(selGarantia === GarantiaLocacao.FIADOR && selFiador) && (
                              <div>
                                <Card>
                                  <CardHeader>
                                    <DialogTitle className='flex items-center'>Selecionar o Fiador</DialogTitle>
                                  </CardHeader>
                                  <CardContent className='mt-2 h-120'>
                                    <ListarClientes limitView={1} txtVinc='Vincular Locação' onSelectCliente={handleSelectFiador} exclude='' />
                                  </CardContent>
                                </Card>
                              </div>
                            )}

                            {(locacaoFiadores.fields.length > 0) && (
                              <div>
                                <div className="grid grid-cols-2 gap-2 items-center justify-between">
                                  <Label>Fiadores</Label>
                                  <button
                                    className='border bg-zinc-200 hover:bg-zinc-400 rounded'
                                    type="button"
                                    onClick={() => { setSelFiador(true) }}
                                  >
                                    Adicionar
                                  </button>
                                </div>
                                {locacaoFiadores.fields.map((field, index) => (
                                  <div className='flex items-center gap-2 mt-2'>
                                    <Label >{field.nome}</Label>
                                    <button
                                      className='border bg-zinc-200 hover:bg-zinc-400'
                                      type="button"
                                      onClick={() => locacaoFiadores.remove(index)}
                                    >
                                      <X className='px-1'></X>
                                    </button>
                                  </div>
                                ))}
                              </div>
                              // <div>
                              //   <div className='mt-2'>
                              //     <Label>Fiador: {selFiador?.nome}</Label>
                              //   </div>
                              // </div>
                            )}

                            {selGarantia === GarantiaLocacao.TITULO_CAPITALIZACAO && (
                              <div className='mt-2'>
                                <Label htmlFor="titulocap">Número do Título</Label>
                                <Input id="titulocap" type="number"
                                  {...imovelLocAlt.register('tituloCap.numeroTitulo')}
                                  helperText={imovelLocAlt.formState?.errors?.tituloCap?.numeroTitulo?.message}
                                  onChange={(e) => { imovelLocAlt.setValue('tituloCap.numeroTitulo', e.target.value) }}
                                />
                              </div>
                            )}

                            {selGarantia === GarantiaLocacao.SEGURO_FIANCA && (
                              <div className='mt-2'>
                                <Label htmlFor="numseguro">Número do Seguro</Label>
                                <Input id="numseguro" type="number"
                                  {...imovelLocAlt.register('seguroFianca.numeroSeguro')}
                                  helperText={imovelLocAlt.formState?.errors?.seguroFianca?.numeroSeguro?.message}
                                  onChange={(e) => { imovelLocAlt.setValue('seguroFianca.numeroSeguro', e.target.value) }}
                                />
                              </div>
                            )}

                            {selGarantia === GarantiaLocacao.DEPOSITO_CALCAO && (
                              <div>
                                <div className='mt-2'>
                                  <Label htmlFor="valdepCalcao">Valor do depósito</Label>
                                  <Input id="valdepCalcao" type="number" placeholder='0,00'
                                    {...imovelLocAlt.register('depCalcao.valorDeposito')}
                                    helperText={imovelLocAlt.formState?.errors?.depCalcao?.valorDeposito?.message}
                                    onChange={(e) => { imovelLocAlt.setValue('depCalcao.valorDeposito', parseFloat(e.target.value)) }}
                                  />
                                </div>
                                <div className='mt-2'>
                                  <Label htmlFor="qtddepCalcao">Quantidade de meses</Label>
                                  <Input id="qtddepCalcao" type="number"
                                    {...imovelLocAlt.register('depCalcao.quantidadeMeses')}
                                    helperText={imovelLocAlt.formState?.errors?.depCalcao?.quantidadeMeses?.message}
                                    onChange={(e) => { imovelLocAlt.setValue('depCalcao.quantidadeMeses', parseFloat(e.target.value)) }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className='mt-2'>
                              <Label htmlFor="status">Situação da Locação</Label>
                              <Select
                                onValueChange={(e: LocacaoStatus) => {
                                  imovelLocAlt.setValue('status', e)
                                }
                                }>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione a situação" />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_LOCACAO_OPTIONS.map((status) => (
                                    <SelectItem key={status.label} value={status.value}>
                                      {status.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </form>
                          <DialogFooter>
                            <Button type="submit">Salvar Locação</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      {/* <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button> */}
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })
            ))}
          </div>
        </TabsContent>

        {/*Fianças */}
        <TabsContent value="finance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Fianças</h2>
          </div>

          {cliente?.fiador?.locacoes?.map((locacao) => (
            <Card key={locacao.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{locacao.id}</span>
                  <Badge variant="default">{locacao.imovel?.tipo}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 flex items-center mt-2">
                  <Label>Locatário</Label>
                  <p className="font-semibold">
                    {locacao?.locatarios?.map((locatario) => (
                      <span>{locatario.pessoa?.nome}</span>
                    ))}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 flex items-center mt-2">
                  <Label>Valor do Aluguel</Label>
                  <p className="font-semibold">
                    R$ {locacao.valor_aluguel.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center mt-4">
                  <Label>Período</Label>
                  <p className="flex items-center text-[0.70rem]">
                    <Calendar className="mr-2 h-4 w-4" />
                    {new Date(locacao.dataInicio).toLocaleDateString('pt-BR')} -
                    {locacao.dataFim
                      ? new Date(locacao.dataFim).toLocaleDateString('pt-BR')
                      : 'Atual'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 items-center mt-4">
                  <Label>Imóvel</Label>
                  <p className="flex flex-col items-center text-[0.70rem]">
                    {locacao.imovel?.tipo.toString() + ", " + locacao.imovel?.endereco.logradouro.toString() + " " + locacao.imovel?.endereco.bairro + " " + locacao.imovel?.endereco.cidade}
                  </p>
                </div>
                <div className='flex justify-end'>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => { handlerDetailImovel(parseFloat(locacao?.imovelId.toString())) }}
                    style={
                      {
                        fontSize: '0.6rem',
                        fontWeight: 'Bold'
                      }}
                  >
                    Ver detalhes
                  </Button>
                </div>
                <hr className="border-t border-gray-300 mt-5" />
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Propriedade</DialogTitle>
                      <DialogDescription>
                        Preencha os detalhes da nova propriedade para este cliente.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div>
                        <Label htmlFor="imovel">Imóvel</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o imóvel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apt1">Apartamento Centro</SelectItem>
                            <SelectItem value="casa1">Casa de Praia</SelectItem>
                            <SelectItem value="kitnet1">Kitnet Universitária</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                    <DialogFooter>
                      <Button type="submit">Adicionar Propriedade</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                {/* <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button> */}
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

      </Tabs>
    </div>
  )
}
