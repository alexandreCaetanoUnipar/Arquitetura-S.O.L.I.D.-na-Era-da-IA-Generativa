// --- 1. D.I.P. (Dependency Inversion Principle) & S.R.P. (Single Responsibility Principle) ---
// Criamos uma interface para o sistema de cobrança para que o sistema não dependa do Stripe.
interface IMetodoPagamento {
    processar(usuarioId: string, valor: number): void;
}

// Implementação concreta do Stripe
class SistemaCobrancaStripe implements IMetodoPagamento {
    processar(usuarioId: string, valor: number): void {
        console.log(`Cobrando R$${valor} via Stripe do usuário ${usuarioId}`);
    }
}

// Implementação de um novo método (ex: PayPal) sem alterar a lógica central (O.C.P.)
class SistemaCobrancaPayPal implements IMetodoPagamento {
    processar(usuarioId: string, valor: number): void {
        console.log(`Cobrando R$${valor} via PayPal do usuário ${usuarioId}`);
    }
}

// Serviço de cobrança isolado (S.R.P.)
class ServicoFinanceiro {
    constructor(private metodoPagamento: IMetodoPagamento) {}

    executarCobranca(usuarioId: string, valor: number): void {
        this.metodoPagamento.processar(usuarioId, valor);
    }
}

/ --- 2. I.S.P. (Interface Segregation Principle) ---
// Dividimos a interface "faz-tudo" em interfaces menores e específicas.
interface IGeradorTexto {
    gerarTexto(prompt: string): string;
}

interface IGeradorImagem {
    gerarImagem(prompt: string): string;
}

interface IGeradorAudio {
    gerarAudio(prompt: string): string;
}

interface IGeradorVideo { // Novo recurso solicitado
    gerarVideo(prompt: string): string;
}

// 3. A classe principal que gerencia tudo
class AssistenteOmniIA implements IModelosIA {
    public nomeModelo: string;

    constructor(nomeModelo: string) {
        this.nomeModelo = nomeModelo;
    }

    // Processador central cheio de condicionais
    processarRequisicaoUsuario(prompt: string, tipo: string): void {
        console.log(`Iniciando processamento com ${this.nomeModelo}...`);

        if (tipo === "TEXTO") {
            this.gerarTexto(prompt);
        } else if (tipo === "IMAGEM") {
            this.gerarImagem(prompt);
        } else if (tipo === "AUDIO") {
            this.gerarAudio(prompt);
        } else {
            throw new Error("Tipo de IA não suportado pelo sistema.");
        }
       
        // Finaliza cobrando o usuário direto aqui
        this.registrarCobranca(1.50);
    }

    gerarTexto(prompt: string): string {
        return `[Texto Gerado]: Respondendo ao prompt: ${prompt}`;
    }

    gerarImagem(prompt: string): string {
        return `[Imagem Gerada]: URL da imagem baseada em: ${prompt}`;
    }

    gerarAudio(prompt: string): string {
        return `[Áudio Gerado]: Arquivo de voz para: ${prompt}`;
    }

    registrarCobranca(valor: number): void {
        const stripe = new SistemaCobrancaStripe();
        stripe.cobrar("user_999", valor);
    }
}

// --- 3. L.S.P. (Liskov Substitution Principle) ---
// As classes agora implementam apenas o que realmente entregam.
class ModeloChatGPT implements IGeradorTexto {
    gerarTexto(prompt: string): string {
        return `Texto gerado pelo ChatGPT: ${prompt}`;
    }
}

class ModeloDallE implements IGeradorImagem {
    gerarImagem(prompt: string): string {
        return `Imagem gerada pelo Dall-E para: ${prompt}`;
    }
}

class ModeloSora implements IGeradorVideo {
    gerarVideo(prompt: string): string {
        return `Vídeo gerado pela Sora: ${prompt}`;
    }
}
