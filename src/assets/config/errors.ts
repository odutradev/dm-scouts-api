interface ResponseError {
  statusCode: 100 | 101 | 102 | 200 | 201 | 202 | 204 | 301 | 302 | 304 | 400 | 401 | 403 | 404 | 409 | 429 | 500 | 501 | 502 | 503;
  message: string;
};

export type ResponseErrorsParams = 
  | "system_role_modification_forbidden"
  | "unauthorized_form_submission"
  | "content_contains_badwords"
  | "user_already_registered"
  | "no_execution_permission"
  |  "no_products_available"
  | "user_already_in_space"
  | "control_access_denied"
  | "user_already_in_class"
  | "investment_not_found"
  | "space_already_exists" 
  | "admin_access_denied"
  | "no_credentials_sent" 
  | "user_already_exists" 
  | "form_already_exists" 
  | "role_already_exists" 
  | "invalid_credentials" 
  | "user_not_registered"
  | "category_not_found"
  | "key_already_exists" 
  | "no_slots_available"
  | "token_is_not_valid"
  | "insufficient_coins" 
  | "user_not_in_space"
  | "product_not_found"
  | "user_not_in_class"
  | "ticket_not_found" 
  | "wallet_not_found" 
  | "base_not_found" 
  | "score_not_found" 
  | "team_not_found" 
  | "space_not_found" 
  | "internal_error" 
  | "invalid_params" 
  | "user_not_found" 
  | "role_not_found" 
  | "food_not_found" 
  | "form_not_found" 
  | "key_not_found" 
  | "post_not_found" 
  | "access_denied"
  | "invalid_data" 
  | "no_data_sent" 
  | "no_token"
  | "user_has_not_been_registered"

  export const ResponseErrors: Record<ResponseErrorsParams, ResponseError> = {
    system_role_modification_forbidden: {
      message: "Não é permitido modificar ou excluir funções do sistema",
      statusCode: 403,
    },
    user_has_not_been_registered: {
      message: "Usuário não registrado",
      statusCode: 401,
    },
    no_execution_permission: {
      message: "Execução não autorizada",
      statusCode: 403,
    },
    internal_error: {
      message: "Erro no servidor",
      statusCode: 500,
    },
    no_credentials_sent: {
      message: "Nenhuma credencial enviada",
      statusCode: 401,
    },
    no_data_sent: {
      message: "Nenhum dado enviado",
      statusCode: 400,
    },
    invalid_credentials: {
      message: "Credenciais inválidas",
      statusCode: 401,
    },
    no_token: {
      message: "Token ausente, autorização negada",
      statusCode: 400,
    },
    token_is_not_valid: {
      message: "Token inválido",
      statusCode: 401,
    },
    user_not_found: {
      message: "Usuário não encontrado",
      statusCode: 404,
    },
    category_not_found: {
      message: "Categoria não encontrada",
      statusCode: 404,
    },
    score_not_found: {
      message: "Pontuação não encontrada",
      statusCode: 404,
    },
    product_not_found: {
      message: "Produto não encontrado",
      statusCode: 404,
    },
    form_not_found: {
      message: "Formulário não encontrado",
      statusCode: 404,
    },
    wallet_not_found: {
      message: "Carteira não encontrada",
      statusCode: 404,
    },
    post_not_found: {
      message: "Post não encontrado",
      statusCode: 404,
    },
    ticket_not_found: {
      message: "Ticket não encontrado",
      statusCode: 404,
    },
    base_not_found: {
      message: "Base não encontrada",
      statusCode: 404,
    },
    team_not_found: {
      message: "Time não encontrado",
      statusCode: 404,
    },
    food_not_found: {
      message: "Comida não encontrada",
      statusCode: 404,
    },
    key_not_found: {
      message: "Chave não encontrada",
      statusCode: 404,
    },
    role_not_found: {
      message: "Função não encontrada",
      statusCode: 404,
    },
    space_not_found: {
      message: "Espaço não encontrado",
      statusCode: 404,
    },
    investment_not_found: {
      message: "Investimento não encontrado",
      statusCode: 404,
    },
    user_already_exists: {
      message: "Usuário já existe",
      statusCode: 409,
    },
    role_already_exists: {
      message: "Função já existe",
      statusCode: 409,
    },
    form_already_exists: {
      message: "Formulário já existe",
      statusCode: 409,
    },
    user_already_registered: {
      message: "Usuário já registrado",
      statusCode: 409,
    },
    space_already_exists: {
      message: "Espaço já existe",
      statusCode: 409,
    },
    key_already_exists: {
      message: "Chave já existe",
      statusCode: 409,
    },
    access_denied: {
      message: "Acesso negado",
      statusCode: 401,
    },
    control_access_denied: {
      message: "Acesso de controle negado",
      statusCode: 401,
    },
    admin_access_denied: {
      message: "Acesso negado para administrador",
      statusCode: 401,
    },
    invalid_params: {
      message: "Parâmetros inválidos",
      statusCode: 400,
    },
    invalid_data: {
      message: "Dados inválidos",
      statusCode: 400,
    },
    user_not_registered: {
      message: "Usuário não registrado",
      statusCode: 404,
    },
    no_slots_available: {
      message: "Sem vagas disponíveis",
      statusCode: 409,
    },
    no_products_available: {
      message: "Sem produtos disponíveis",
      statusCode: 409,
    },
    insufficient_coins: {
      message: "Moedas insuficientes",
      statusCode: 409,
    },
    content_contains_badwords: {
      message: "Conteúdo contém palavras proibidas",
      statusCode: 400,
    },
    user_already_in_space: {
      message: "Usuário já está no espaço",
      statusCode: 409,
    },
    user_not_in_space: {
      message: "Usuário não está no espaço",
      statusCode: 404,
    },
    user_already_in_class: {
      message: "Usuário já está na turma",
      statusCode: 409,
    },
    user_not_in_class: {
      message: "Usuário não está na turma",
      statusCode: 404,
    },
    unauthorized_form_submission: {
      message: "Envio de formulário não autorizado",
      statusCode: 403,
    },
  };  