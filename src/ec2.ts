import {
  _InstanceType,
  AuthorizeSecurityGroupIngressCommand,
  AuthorizeSecurityGroupIngressCommandInput,
  AuthorizeSecurityGroupIngressCommandOutput,
  CreateSecurityGroupCommand, CreateSecurityGroupCommandInput,
  CreateSecurityGroupResult,
  DescribeInstancesCommand,
  EC2Client, IamInstanceProfileAssociation, IamInstanceProfileSpecification,
  ImportKeyPairCommand,
  ImportKeyPairCommandInput,
  ImportKeyPairCommandOutput, RunInstancesCommand, RunInstancesCommandInput, RunInstancesCommandOutput
} from "@aws-sdk/client-ec2"; // ES Modules import
import type { EC2ClientConfig } from "@aws-sdk/client-ec2";
import 'dotenv/config'

const config: EC2ClientConfig = {};
const client = new EC2Client(config);

/**
Importa una llave para la creación de una instancia.
 @param key {string} El contenido de la llave. Por defecto usa la llave SSH en el archivo de variables de entorno "SSH_KEY".
 @param name{string} El nombre asignado de la llave. Por defecto la nombra "my_key_pair"
 */
async function ImportKeyPair(key: string = process.env.SSH_KEY, name: string = "my_key_pair"): Promise<ImportKeyPairCommandOutput> {
  const input: ImportKeyPairCommandInput = {
    TagSpecifications: [
      {
        ResourceType: "key-pair",
        Tags: [
          {
            Key: name,
            Value: key,
          },
        ],
      },
    ],
    DryRun: false,
    KeyName: name,
    PublicKeyMaterial: new Uint8Array(),
  };
  const command = new ImportKeyPairCommand(input);
  const response: ImportKeyPairCommandOutput = await client.send(command);

  return response;
}

/**
 * Crea un grupo de seguridad vacío.
 * @param name{string} Nombre del grupo de seguridad.
 * @param description{string} Descripción del grupo de seguridad.
 */
async function CreateSecurityGroup(name: string = "my_security_group", description: string = ""): Promise<CreateSecurityGroupResult> {
  const input: CreateSecurityGroupCommandInput = {
    GroupName: name,
    Description: description,
  }
  const command: CreateSecurityGroupCommand = new CreateSecurityGroupCommand(input);
  const result: CreateSecurityGroupResult = await client.send(command);
  return result;
}

/**
 * Añade una IP a un grupo de seguridad existente.
 * @param groupId La ID del grupo de seguridad.
 * @param port El puerto que se desea abrir para el protocolo deseado
 * @param ip La IP a permitir. En caso de no ingresar algo, se obtiene la ip pública desde la ejecución del programa.
 * @param protocol El protocolo IP a permitir. Por defecto es TCP.
 */
async function AllowIPForSG(groupId: string, port: number, ip: string = "", protocol: string = "tcp"): Promise<AuthorizeSecurityGroupIngressCommandOutput> {
  if (ip == "") {
    const res: Response = await fetch("http://checkip.amazonaws.com");
    ip = (await res.text()).trim();
  }
  try {
    const input: AuthorizeSecurityGroupIngressCommandInput = {
      GroupId: groupId,
      FromPort: port,
      ToPort: port,
      IpProtocol: protocol,
      CidrIp: ip
    }
    const command: AuthorizeSecurityGroupIngressCommand = new AuthorizeSecurityGroupIngressCommand(input);
    const result: AuthorizeSecurityGroupIngressCommandOutput = await client.send(command);
    return result;
  } catch (e) {
    console.error(e);
    console.log("Hubo un error al agregar esa IP. Es posible que ya estuviera en el grupo de seguridad.", e)
  }
}

/**
 * Crea una nueva instancia EC2.
 * @param iamProfile{IamInstanceProfileSpecification} Especificación del perfil AMI a usar en la instancia.
 * @param instanceType{_InstanceType} Enumerador string con el tipo de instancia a usar.
 * @param keyPath{string} Nombre de la llave SSH a usar.
 * @param securityGroupIds{[string]} Lista con las IDs de grupos de seguridad a usar.
 * @param instanceName{string} Nombre de la instancia.
 * @param subnetId{string} ID de la subnet a usar.
 * @param userData{string} Script de inicio para la instancia.
 *
 */

export async function CreateEC2Instance(iamProfile: IamInstanceProfileSpecification,
  instanceType: _InstanceType,
  keyPath: string,
  securityGroupIds: [string],
  instanceName: string = `ec2-${Date.now()}`,
  subnetId: string,
  userData: string): Promise<RunInstancesCommandOutput> {
  const input: RunInstancesCommandInput = {
    IamInstanceProfile: iamProfile,
    KeyName: keyPath,
    InstanceType: instanceType,
    SecurityGroups: securityGroupIds,
    TagSpecifications: [{
      'ResourceType': 'instance',
      'Tags': [{ 'Key': 'Name', 'Value': instanceName }]
    }],
    SubnetId: subnetId,
    UserData: userData,
    MinCount: 1,
    MaxCount: 1,
  }
  const command: RunInstancesCommand = new RunInstancesCommand(input);
  const result: RunInstancesCommandOutput = await client.send(command);
  return result;
}

export async function ListEC2Instances() {
  const command = new DescribeInstancesCommand({});
  const result = await client.send(command);
  return result;
}
