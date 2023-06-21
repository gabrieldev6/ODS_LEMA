export class PedidoAnonimo {
  readonly id_pedidoAnonimo: number;
  readonly material: string;
  readonly maquina: string;
  estado: Estado;
  arquivo: Buffer | null;
  readonly cor: string;
  readonly descricao: string;
  readonly comentario: string;
  readonly codigo: string;
  readonly id_horaDisponivel: number;
  readonly id_autorAutorizadorAnonimo: number | null;

  constructor(
    material: string,
    maquina: string,
    estado: Estado,
    arquivo: Buffer,
    cor: string,
    descricao: string,
    comentario: string,
    codigo: string,
    id_horaDisponivel: number,
    id_autorAutorizadorAnonimo: number | null
  ) {
    this.material = material;
    this.maquina = maquina;
    this.estado = estado;
    this.arquivo = arquivo;
    this.cor = cor;
    this.descricao = descricao;
    this.comentario = comentario;
    this.codigo = codigo;
    this.id_horaDisponivel = id_horaDisponivel;
    this.id_autorAutorizadorAnonimo = id_autorAutorizadorAnonimo;
  }
  
  public get Material(): string {
    return this.material;
  }
  public get Maquina(): string {
    return this.maquina;
  }
  public get Estado(): Estado {
    return this.estado;
  }
  public get Arquivo(): Buffer | null{
    return this.arquivo;
  }

  public get Cor(): string {
    return this.cor;
  }

  public get Descricao(): string {
    return this.descricao;
  }

  public get Comentario(): string {
    return this.comentario;
  }

  public get Id_horaDisponivel(): number {
    return this.id_horaDisponivel;
  }

  public get Id_autorAutorizador(): number | null{
    return this.Id_autorAutorizador;
  }
  public setEstado(estado: Estado) {
    if (
      this.estado == Estado.pendente &&
      estado == (Estado.aprovado || Estado.reprovado)
    ) {
      this.estado = estado;
    } else if (this.estado == Estado.aprovado && estado == Estado.concluido) {
      this.estado = estado;
    } else if (this.estado == Estado.concluido) {
      throw "pedido ja concluido, nao pode ser alterado";
    } else {
      throw "escolha um estado valido";
    }
  }
}

export enum Estado {
  pendente = "pendente",
  aprovado = "aprovado",
  produzindo = "produzindo",
  concluido = "concluido",
  reprovado = "reprovado",
}
